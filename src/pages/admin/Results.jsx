import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Edit3, Save } from 'lucide-react';
import { api } from '../../services/api.js';


const panel = 'min-w-0 rounded-lg border border-line bg-panel p-[18px] shadow-panel max-[520px]:p-3.5';
const formGrid = 'grid gap-3.5';
const primaryButton = 'flex items-center justify-center gap-2 rounded-[7px] border-0 bg-primary px-4 py-[11px] font-extrabold text-white transition hover:bg-primary-dark';

export default function Results() {
  const [lookups, setLookups] = useState({ students: [], subjects: [], sessions: [], terms: [] });
  const [filters, setFilters] = useState({ studentId: '', sessionId: '', termId: '', attendance: '', principalRemark: '' });
  const [scores, setScores] = useState({});
  const [message, setMessage] = useState('');
  const [loadingSavedResults, setLoadingSavedResults] = useState(false);
  const [hasSavedResults, setHasSavedResults] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api('/students'), api('/subjects'), api('/sessions'), api('/terms')])
      .then(([students, subjects, sessions, terms]) => {
        setLookups({ students, subjects, sessions, terms });
        setFilters({
          studentId: students[0]?.id || '',
          sessionId: sessions.find((s) => s.is_current)?.id || sessions[0]?.id || '',
          termId: terms.find((t) => t.is_current)?.id || terms[0]?.id || '',
          attendance: '',
          principalRemark: ''
        });
      })
      .catch((err) => {
        setMessage(err.message || 'Unable to load students, subjects, sessions, and terms.');
      });
  }, []);

  // Helper to normalize different ID shapes
  const normalizeSubjectId = (id) => {
    if (!id) return null;
    return typeof id === 'object' && id.id ? id.id : String(id);
  };

  const requestIdRef = useRef(0);

  // Extracted as a standalone function so it can be called after save too
  const loadSavedResults = useCallback(async (studentId, sessionId, termId, subjects, { silent = false } = {}) => {
    if (!studentId || !sessionId || !termId || !subjects.length) return;

    if (!silent) setLoadingSavedResults(true);
    const currentId = ++requestIdRef.current;
    try {
      const rows = await api(`/results/student/${studentId}?sessionId=${sessionId}&termId=${termId}`);
      if (currentId !== requestIdRef.current) return; // stale response

      const nextScores = {};
      rows.forEach((row) => {
        const subjectId = normalizeSubjectId(row.subject_id)
          || normalizeSubjectId(subjects.find((s) => s.subject_name === row.subject_name)?.id);
        if (!subjectId) return;
        nextScores[subjectId] = {
          firstCa: row.first_ca ?? '',
          secondCa: row.second_ca ?? '',
          exam: row.exam ?? ''
        };
      });

      setScores(nextScores);
      setHasSavedResults(rows.length > 0);
      setFilters((current) => ({
        ...current,
        attendance: rows[0]?.attendance ?? '',
        principalRemark: rows[0]?.principal_remark ?? ''
      }));
      if (!silent) {
        setMessage(rows.length
          ? 'Loaded saved results. You can edit and save changes.'
          : 'No saved results found for this selection.');
      }
    } catch (err) {
      if (!silent) {
        setHasSavedResults(false);
        setScores({});
        setMessage(err.message || 'Unable to load saved results.');
      }
    } finally {
      if (!silent) setLoadingSavedResults(false);
    }
  }, []);

  // Re-run whenever the student/session/term selection changes
  useEffect(() => {
    loadSavedResults(filters.studentId, filters.sessionId, filters.termId, lookups.subjects);
  }, [filters.studentId, filters.sessionId, filters.termId, lookups.subjects]);

  const totals = useMemo(() => {
    return Object.fromEntries(Object.entries(scores).map(([subjectId, row]) => {
      const total = Number(row.firstCa || 0) + Number(row.secondCa || 0) + Number(row.exam || 0);
      return [subjectId, total];
    }));
  }, [scores]);

  function update(subjectId, key, value) {
    setScores((current) => ({
      ...current,
      [subjectId]: { ...current[subjectId], [key]: value }
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    // 1️⃣ Load any existing results first so we can preserve unchanged values
    const existingRows = await api(`/results/student/${filters.studentId}?sessionId=${filters.sessionId}&termId=${filters.termId}`).catch(() => []);
    const existingMap = {};
    existingRows.forEach(row => {
      const sid = row.subject_id?.id || row.subject_id || lookups.subjects.find(s => s.subject_name === row.subject_name)?.id;
      if (sid) {
        existingMap[sid] = {
          firstCa: row.first_ca ?? 0,
          secondCa: row.second_ca ?? 0,
          exam: row.exam ?? 0
        };
      }
    });

    // 2️⃣ Build the payload
    const existingAttendance = existingRows[0]?.attendance ?? '';
    const existingPrincipal = existingRows[0]?.principal_remark ?? '';
    const payload = {
      ...filters,
      attendance: filters.attendance !== '' ? filters.attendance : existingAttendance,
      principalRemark: filters.principalRemark !== '' ? filters.principalRemark : existingPrincipal,
      scores: lookups.subjects
        .filter((subject) => {
          const sid = subject.id;
          const input = scores[sid] || {};
          const existing = existingMap[sid] || {};
          const hasInput =
            (input.firstCa !== undefined && input.firstCa !== '') ||
            (input.secondCa !== undefined && input.secondCa !== '') ||
            (input.exam !== undefined && input.exam !== '');
          const hasExisting = existing.firstCa != null || existing.secondCa != null || existing.exam != null;
          return hasInput || hasExisting;
        })
        .map((subject) => {
          const sid = subject.id;
          const input = scores[sid] || {};
          const existing = existingMap[sid] || {};
          return {
            subjectId: sid,
            firstCa: input.firstCa !== undefined && input.firstCa !== '' ? Number(input.firstCa) : existing.firstCa,
            secondCa: input.secondCa !== undefined && input.secondCa !== '' ? Number(input.secondCa) : existing.secondCa,
            exam: input.exam !== undefined && input.exam !== '' ? Number(input.exam) : existing.exam,
          };
        }),
    };

    try {
      await api('/results/bulk', { method: 'POST', body: JSON.stringify(payload) });
      setMessage('Results saved successfully');
      setHasSavedResults(true);
      // 3️⃣ Re-fetch from server to confirm what was actually stored
      //    (silently updates scores, attendance and principalRemark without
      //    resetting the message or showing a loading indicator)
      await loadSavedResults(filters.studentId, filters.sessionId, filters.termId, lookups.subjects, { silent: true });
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Failed to save results');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <header className="mb-5 flex items-start justify-between gap-4 max-[760px]:grid">
        <h1>Result Upload</h1>
        <p>{hasSavedResults ? 'Editing existing results for the selected student and term.' : 'Enter 1st CA, 2nd CA, and examination scores for each subject.'}</p>

      </header>
      <form className={`${panel} ${formGrid}`} onSubmit={submit}>
        <div className="grid grid-cols-4 gap-3 max-[1040px]:grid-cols-2 max-[760px]:grid-cols-1">
          <select required value={filters.sessionId} onChange={(e) => setFilters({ ...filters, sessionId: e.target.value })}>
            {lookups.sessions.map((item) => <option key={item.id} value={item.id}>{item.session_name}</option>)}
          </select>
          <select required value={filters.termId} onChange={(e) => setFilters({ ...filters, termId: e.target.value })}>
            {lookups.terms.map((item) => <option key={item.id} value={item.id}>{item.term_name}</option>)}
          </select>
          <select required value={filters.studentId} onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}>
            {lookups.students.map((item) => <option key={item.id} value={item.id}>{item.first_name} {item.last_name}</option>)}
          </select>
          <input type="number" min="0" placeholder="Attendance" value={filters.attendance} onChange={(e) => setFilters({ ...filters, attendance: e.target.value })} />
        </div>
        <textarea placeholder="Principal's remark" value={filters.principalRemark} onChange={(e) => setFilters({ ...filters, principalRemark: e.target.value })} />
        <div className="mb-3 rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 sm:hidden">
          Use the responsive row view on mobile to enter scores.
        </div>
        {loadingSavedResults && (
          <p className="m-0 text-sm font-semibold text-slate-500">Loading saved results...</p>
        )}
        <div className="responsive-table">
          <table>
            <thead><tr><th>Subject</th><th>1st CA</th><th>2nd CA</th><th>Exam</th><th>Total</th></tr></thead>
            <tbody>
              {lookups.subjects.map((subject) => (
                <tr key={subject.id}>
                  <td data-label="Subject">{subject.subject_name}</td>
                  <td data-label="1st CA"><input type="number" min="0" max="20" value={scores[subject.id]?.firstCa || ''} onChange={(e) => update(subject.id, 'firstCa', e.target.value)} /></td>
                  <td data-label="2nd CA"><input type="number" min="0" max="20" value={scores[subject.id]?.secondCa || ''} onChange={(e) => update(subject.id, 'secondCa', e.target.value)} /></td>
                  <td data-label="Exam"><input type="number" min="0" max="60" value={scores[subject.id]?.exam || ''} onChange={(e) => update(subject.id, 'exam', e.target.value)} /></td>
                  <td data-label="Total"><strong>{totals[subject.id] || 0}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {message && <p className="m-0 font-bold text-primary-dark">{message}</p>}
        <button type="submit" className={primaryButton} disabled={saving || loadingSavedResults}>
          {hasSavedResults ? <Edit3 size={18} /> : <Save size={18} />}
          {saving ? 'Saving...' : (hasSavedResults ? 'Update Results' : 'Save Results')}
        </button>
      </form>
    </section>
  );
}
