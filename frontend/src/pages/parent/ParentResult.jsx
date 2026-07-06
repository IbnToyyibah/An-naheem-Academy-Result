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
      className="p-5 rounded-2xl border border-line bg-panel shadow-panel max-w-5xl mx-auto max-[760px]:p-4 max-[520px]:p-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="print-header hidden border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/Annaheem.jpeg.png" alt="Annaheem Academy logo" className="h-16 w-16 object-contain" />
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 m-0 uppercase leading-none">AN-NAHEEM ACADEMY</h1>
              <p className="text-xs font-semibold text-slate-600 m-0 mt-1">Knowledge, Discipline & Excellence</p>
              <p className="text-[10px] text-slate-400 m-0 mt-0.5">Junior Secondary School Portal</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider m-0">TERM RESULT SHEET</h2>
            <p className="text-[11px] text-slate-600 m-0 mt-1">
              Session: <span className="font-semibold text-slate-900">{lookups.sessions.find(s => String(s.id) === String(filters.sessionId))?.session_name || 'N/A'}</span>
            </p>
            <p className="text-[11px] text-slate-600 m-0">
              Term: <span className="font-semibold text-slate-900">{lookups.terms.find(t => String(t.id) === String(filters.termId))?.term_name || 'N/A'}</span>
            </p>
          </div>
        </div>

        {/* Student details grid */}
        <div className="mt-4 grid grid-cols-4 gap-4 border-t border-slate-300 py-3 text-xs">
          <div>
            <span className="block text-slate-500 uppercase text-[9px] font-bold">Student Name</span>
            <span className="font-bold text-slate-900">{profile?.first_name} {profile?.last_name}</span>
          </div>
          <div>
            <span className="block text-slate-500 uppercase text-[9px] font-bold">Admission Number</span>
            <span className="font-bold text-slate-900">{profile?.admissionNumber || profile?.admission_number}</span>
          </div>
          <div>
            <span className="block text-slate-500 uppercase text-[9px] font-bold">Class / Stream</span>
            <span className="font-bold text-slate-900">{profile?.class_name || 'N/A'} {profile?.stream ? `(${profile.stream})` : ''}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-slate-500 uppercase text-[9px] font-bold">Gender</span>
              <span className="font-bold text-slate-900 capitalize">{profile?.gender || 'N/A'}</span>
            </div>
            {profile?.passport_path && (
              <img src={assetUrl(profile.passport_path)} alt="Passport" className="h-10 w-10 rounded object-cover border border-slate-200" />
            )}
          </div>
        </div>
      </div>
      <header className="page-title flex flex-col items-start mb-3.5 no-print">
        <h1 className="text-xl font-bold text-primary max-[760px]:text-lg">View Result</h1>
        {profile && (
          <div className="flex items-center gap-3 mt-2">
            {profile.passport_path && (
              <img
                src={assetUrl(profile.passport_path)}
                alt="Passport"
                className="h-12 w-12 rounded-full object-cover border border-line"
              />
            )}
            <div>
              <p className="font-bold text-sm">{profile.first_name} {profile.last_name}</p>
              <p className="text-xs text-muted">{profile.admissionNumber || profile.admission_number}</p>
              {profile.gender && <p className="text-xs text-muted">Gender: {profile.gender}</p>}
            </div>
          </div>
        )}
        <button className="primary flex items-center gap-2 mt-2 px-3 py-2 text-xs font-bold rounded-lg" onClick={() => window.print()}>
          <Printer size={12} /> Print
        </button>
      </header>

      <div className="panel form flex flex-col gap-3 mb-5 no-print p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <select
            value={filters.sessionId}
            onChange={(e) => { if (!selectorsDisabled) setFilters((prev) => ({ ...prev, sessionId: e.target.value })); }}
            className={`border rounded-lg py-2 px-3 text-sm ${selectorsDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
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
            className={`border rounded-lg py-2 px-3 text-sm ${selectorsDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
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
          <p className="text-xs text-slate-500 mt-1">Session and term are locked by the school for this result.</p>
        )}
      </div>

      <section className="panel p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3.5">
          <h2 className="text-base font-bold text-slate-800">Result Sheet</h2>
          {loading && <span className="text-xs text-slate-500">Loading...</span>}
        </div>
        {message && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">{message}</p>}

        <div className="responsive-table overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-5 print:grid-cols-4 print:gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 print:p-2.5">
          <p className="text-xs text-slate-500 print:text-[10px]">Total Score</p>
          <p className="mt-1.5 text-lg font-bold text-slate-900 print:text-sm print:mt-1">{result.summary.totalScore || 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 print:p-2.5">
          <p className="text-xs text-slate-500 print:text-[10px]">Average Score</p>
          <p className="mt-1.5 text-lg font-bold text-slate-900 print:text-sm print:mt-1">{result.summary.averageScore || 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 print:p-2.5">
          <p className="text-xs text-slate-500 print:text-[10px]">Position</p>
          <p className="mt-1.5 text-lg font-bold text-slate-900 print:text-sm print:mt-1">{result.summary.position || 'Pending'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 print:p-2.5">
          <p className="text-xs text-slate-500 print:text-[10px]">Attendance</p>
          <p className="mt-1.5 text-lg font-bold text-slate-900 print:text-sm print:mt-1">{result.summary.attendance || 'Pending'}</p>
        </div>
      </div>

      <p className="mt-5 text-xs text-slate-500 print:mt-4 print:text-[11px] print:text-slate-700">
        Principal's Remark: <span className="font-bold text-slate-900">{result.summary.principalRemark || 'Pending'}</span>
      </p>

      {/* Signature Section for Print */}
      <div className="hidden print:flex mt-12 justify-between gap-12 text-xs">
        <div className="flex flex-col items-center">
          <div className="w-40 border-b border-slate-900 h-8" />
          <span className="mt-1.5 font-bold text-slate-700">Class Teacher's Signature</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-40 border-b border-slate-900 h-8" />
          <span className="mt-1.5 font-bold text-slate-700">Principal's Signature</span>
        </div>
      </div>
    </motion.div>
  );
}
