import { useEffect, useState } from 'react';
import { Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../services/api.js';
import EmptyState from '../../components/EmptyState.jsx';
import { assetUrl } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { defaultSubjects } from '../../utils/subjects.js';

export default function ParentResult() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [lookups, setLookups] = useState({ sessions: [], terms: [], subjects: [] });
  const [filters, setFilters] = useState({ sessionId: '', termId: '' });
  const [result, setResult] = useState(user?.results || { results: [], summary: {} });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(!user && !user?.results);

  useEffect(() => {
    let active = true;

    const loadParentData = async () => {
      try {
        // If we already have lookups/results from login payload, use them
        if (user?.lookups) {
          const sessions = user.lookups.sessions || [];
          const terms = user.lookups.terms || [];
          const subjects = user.lookups.subjects || [];
          const nextFilters = {
            sessionId: user.lookups.latestResult?.sessionId || sessions.find((s) => s.is_current)?.id || sessions[0]?.id || '',
            termId: user.lookups.latestResult?.termId || terms[0]?.id || ''
          };
          setLookups({ sessions, terms, subjects });
          setFilters(nextFilters);
          setProfile(user || null);
          // prefer results from login payload
          if (user.results) {
            setResult(user.results);
            if (active) setLoading(false);
            return;
          }
        }

        const [profileData, lookupsData] = await Promise.all([
          api('/parent/profile', { authRedirect: false }),
          api('/parent/lookups', { authRedirect: false })
        ]);

        if (!active) return;

        setProfile(profileData || null);
        const sessions = lookupsData?.sessions || [];
        const terms = lookupsData?.terms || [];
        const subjects = lookupsData?.subjects || [];
        const nextFilters = {
          sessionId: lookupsData?.latestResult?.sessionId || sessions.find((s) => s.is_current)?.id || sessions[0]?.id || '',
          termId: lookupsData?.latestResult?.termId || terms[0]?.id || ''
        };
        setLookups({ sessions, terms, subjects });
        setFilters(nextFilters);
      } catch (err) {
        const forbiddenMessage = 'You do not have access to this resource';
        if (active) {
          if (err?.status === 403 || err?.message === forbiddenMessage) {
            setMessage('');
          } else {
            setMessage(err.message || 'Unable to load result lookups.');
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadParentData();
    return () => {
      active = false;
    };
  }, []);

  const selectorsDisabled = Boolean(
    (user?.lookups && (user.lookups.latestResult?.sessionId || user.lookups.latestResult?.termId)) ||
    (lookups?.latestResult && (lookups.latestResult.sessionId || lookups.latestResult.termId)) ||
    (result?.results && result.results.length > 0 && user?.lookups?.latestResult)
  );

  useEffect(() => {
    if (!filters.sessionId || !filters.termId) return;
    setMessage('');
    api(`/parent/results?sessionId=${filters.sessionId}&termId=${filters.termId}`, { authRedirect: false })
      .then((data) => setResult(data || { results: [], summary: {} }))
      .catch((err) => {
        const forbiddenMessage = 'You do not have access to this resource';
        if (err?.status === 403 || err?.message === forbiddenMessage) {
          // suppress the backend forbidden message for parent result view
          setMessage('');
        } else {
          setMessage(err.message || 'Unable to load results.');
        }
      });
  }, [filters]);

  return (
    <motion.div
      className="glass p-6 rounded-xl shadow-lg max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="print-header">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img src="/Annaheem.jpeg.png" alt="Annaheem Academy logo" style={{ height: 72 }} />
            <div>
              <div className="text-xl font-bold">Annaheem Academy</div>
              <div className="text-sm">Result Sheet</div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 text-left sm:items-end sm:text-right">
            {profile && (
              <div>
                <div className="font-semibold text-lg">{profile.first_name} {profile.last_name}</div>
                <div className="text-sm">{profile.admissionNumber || profile.admission_number}</div>
                <div className="text-sm">{profile.class_name || 'Class N/A'}</div>
              </div>
            )}
            {profile && profile.passport_path && (
              <img src={assetUrl(profile.passport_path)} alt="Passport" style={{ height: 72, borderRadius: '8px' }} />
            )}
          </div>
        </div>
      </div>
      <header className="page-title flex flex-col items-start mb-4 no-print">
        <h1 className="text-3xl font-bold text-primary">View Result</h1>
        {profile && (
          <div className="flex items-center gap-4 mt-2">
            {profile.passport_path && (
              <img
                src={assetUrl(profile.passport_path)}
                alt="Passport"
                className="h-16 w-16 rounded-full object-cover border border-line"
              />
            )}
            <div>
              <p className="font-semibold">{profile.first_name} {profile.last_name}</p>
              <p className="text-sm text-muted">{profile.admissionNumber || profile.admission_number}</p>
              {profile.gender && <p className="text-sm text-muted">Gender: {profile.gender}</p>}
            </div>
          </div>
        )}
        <button className="primary flex items-center gap-2 mt-2" onClick={() => window.print()}>
          <Printer size={12} /> Print
        </button>
      </header>

      <div className="panel form flex flex-col gap-4 mb-6 no-print">
        <div className="grid gap-4 md:grid-cols-2">
          <select
            value={filters.sessionId}
            onChange={(e) => { if (!selectorsDisabled) setFilters((prev) => ({ ...prev, sessionId: e.target.value })); }}
            className={`border rounded p-3 ${selectorsDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={selectorsDisabled}
          >
            {lookups.sessions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.session_name}
              </option>
            ))}
          </select>
          <select
            value={filters.termId}
            onChange={(e) => { if (!selectorsDisabled) setFilters((prev) => ({ ...prev, termId: e.target.value })); }}
            className={`border rounded p-3 ${selectorsDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={selectorsDisabled}
          >
            {lookups.terms.map((item) => (
              <option key={item.id} value={item.id}>
                {item.term_name}
              </option>
            ))}
          </select>
        </div>

        {selectorsDisabled && (
          <p className="text-sm text-slate-500 mt-2">Session and term are locked by the school for this result.</p>
        )}
      </div>

      <section className="panel">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-2xl font-semibold">Result Sheet</h2>
          {loading && <span className="text-sm text-slate-500">Loading...</span>}
        </div>
        {message && <p className="mb-4 rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</p>}

        <div className="responsive-table overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-[0.12em] text-[11px]">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">Subject</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">1st CA</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">2nd CA</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">Exam</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">Total</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">Grade</th>
                <th className="px-4 py-3 text-left font-semibold">Remark</th>
              </tr>
            </thead>
            <tbody>
              {(
                (lookups.subjects && lookups.subjects.length ? lookups.subjects.map(s => s.subject_name) : defaultSubjects) || []
              ).map((subjectName, index) => {
                const row = (result.results || []).find((r) => r.subject_name === subjectName) || {};
                return (
                  <tr key={row.id || subjectName} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100`}>
                    <td data-label="Subject" className="px-4 py-3 font-medium text-slate-900">{subjectName}</td>
                    <td data-label="1st CA" className="px-4 py-3">{row.first_ca ?? ''}</td>
                    <td data-label="2nd CA" className="px-4 py-3">{row.second_ca ?? ''}</td>
                    <td data-label="Exam" className="px-4 py-3">{row.exam ?? ''}</td>
                    <td data-label="Total" className="px-4 py-3">{row.total ?? ''}</td>
                    <td data-label="Grade" className="px-4 py-3">{row.grade ?? ''}</td>
                    <td data-label="Remark" className="px-4 py-3 text-slate-600">{row.remark ?? ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!result.results.length && !loading && (
          <div className="p-10 text-center text-slate-500">
            <EmptyState title="No result uploaded for this selection" />
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Total Score</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{result.summary.totalScore || 0}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Average Score</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{result.summary.averageScore || 0}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Position</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{result.summary.position || 'Pending'}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Attendance</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{result.summary.attendance || 'Pending'}</p>
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Principal's Remark: <span className="font-semibold text-slate-900">{result.summary.principalRemark || 'Pending'}</span>
      </p>
    </motion.div>
  );
}
