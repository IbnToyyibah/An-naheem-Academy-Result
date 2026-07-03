import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { api } from '../../services/api.js';
import StatCard from '../../components/StatCard.jsx';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [activitiesOpen, setActivitiesOpen] = useState(true);

  useEffect(() => {
    api('/admin/dashboard').then(setData).catch(() => setData({ totals: {}, recentActivities: [] }));
  }, []);

  const totals = data?.totals || {};
  const activities = data?.recentActivities || [];
  const [statsOpen, setStatsOpen] = useState(true);

  return (
    <section>
      <header className="mb-5 flex flex-col gap-3 max-[760px]:grid sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-sm text-slate-500">Current session: {data?.currentSession || 'Not selected'}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[7px] border border-line bg-white px-3 py-2 text-sm font-semibold transition hover:bg-slate-50"
          onClick={() => setStatsOpen((open) => !open)}
          aria-expanded={statsOpen}
        >
          {statsOpen ? 'Hide stats' : 'Show stats'}
          <ChevronDown className={`h-4 w-4 transition-transform ${statsOpen ? 'rotate-180' : ''}`} />
        </button>
      </header>
      {statsOpen && (
        <div className="mb-[18px] grid grid-cols-5 gap-3.5 max-[1040px]:grid-cols-2 max-[760px]:grid-cols-1">
          <StatCard label="Students" value={totals.students} />
          <StatCard label="Parents" value={totals.parents} />
          <StatCard label="Subjects" value={totals.subjects} />
          <StatCard label="Classes" value={totals.classes} />
          <StatCard label="Uploaded Results" value={totals.uploadedResults} />
        </div>
      )}
      <section className="min-w-0 rounded-lg border border-line bg-panel p-[18px] shadow-panel max-[520px]:p-3.5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2>Recent Activities</h2>
            <p className="text-sm text-slate-500">{activities.length} activity{activities.length === 1 ? '' : 'ies'}</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[7px] border border-line bg-white px-3 py-2 text-sm font-semibold transition hover:bg-slate-50"
            onClick={() => setActivitiesOpen((open) => !open)}
            aria-expanded={activitiesOpen}
          >
            {activitiesOpen ? 'Collapse' : 'Expand'}
            <ChevronDown className={`h-4 w-4 transition-transform ${activitiesOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {activitiesOpen && (
          <div className="grid gap-2.5">
            {activities.map((item) => (
              <div className="grid gap-0.5 border-b border-line pb-2.5" key={item.id}>
                <strong>{item.actor}</strong>
                <span>{item.action}</span>
              </div>
            ))}
            {!activities.length && <p className="text-sm text-slate-500">No recent activities yet.</p>}
          </div>
        )}
      </section>
    </section>
  );
}
