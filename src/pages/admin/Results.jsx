import { useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import { api } from '../../services/api.js';

const panel = 'min-w-0 rounded-lg border border-line bg-panel p-[18px] shadow-panel max-[520px]:p-3.5';
const formGrid = 'grid gap-3.5';
const primaryButton = 'flex items-center justify-center gap-2 rounded-[7px] border-0 bg-primary px-4 py-[11px] font-extrabold text-white transition hover:bg-primary-dark';

export default function Results() {
  const [lookups, setLookups] = useState({ students: [], subjects: [], sessions: [], terms: [] });
  const [filters, setFilters] = useState({ studentId: '', sessionId: '', termId: '', attendance: '', principalRemark: '' });
  const [scores, setScores] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([api('/students'), api('/subjects'), api('/sessions'), api('/terms')]).then(([students, subjects, sessions, terms]) => {
      setLookups({ students, subjects, sessions, terms });
      setFilters({
        studentId: students[0]?.id || '',
        sessionId: sessions.find((s) => s.is_current)?.id || sessions[0]?.id || '',
        termId: terms[0]?.id || '',
        attendance: '',
        principalRemark: ''
      });
    });
  }, []);

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
    const payload = {
      ...filters,
      scores: lookups.subjects.map((subject) => ({
        subjectId: subject.id,
        firstCa: scores[subject.id]?.firstCa || 0,
        secondCa: scores[subject.id]?.secondCa || 0,
        exam: scores[subject.id]?.exam || 0
      }))
    };
    console.log('Submitting payload', payload);
    try {
      await api('/results/bulk', { method: 'POST', body: JSON.stringify(payload) });
      setMessage('Results saved successfully');
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Failed to save results');
    }
  }

  return (
    <section>
      <header className="mb-5 flex items-start justify-between gap-4 max-[760px]:grid">
        <h1>Result Upload</h1>
        <p>Enter 1st CA, 2nd CA, and examination scores for each subject.</p>
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
        <button type="submit" className={primaryButton}><Save size={18} /> Save Results</button>
      </form>
    </section>
  );
}
