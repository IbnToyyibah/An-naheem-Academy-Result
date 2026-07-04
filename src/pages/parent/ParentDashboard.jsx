import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, assetUrl } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setMessage('');
    // Prefer cached user profile from login to avoid unnecessary auth redirects
    if (user && (user.first_name || user.admissionNumber || user.admission_number)) {
      setProfile(user);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    api('/parent/profile', { authRedirect: false })
      .then((data) => {
        if (!active) return;
        setProfile(data || user || null);
      })
      .catch((err) => {
        if (!active) return;
        const forbiddenMessage = 'You do not have access to this resource';
        if (err?.status === 403 || err?.message === forbiddenMessage) {
          setMessage('');
        } else {
          setMessage(err.message || 'Unable to load student details.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Parent Dashboard</h1>
        <p className="text-sm text-slate-500">Access your child’s profile, class, and exam result information.</p>
      </header>

      {loading ? (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          Loading student information...
        </div>
      ) : message ? (
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-center text-red-700">
          {message}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              {profile?.passport_path ? (
                <img
                  src={assetUrl(profile.passport_path)}
                  alt="Student passport"
                  className="h-24 w-24 rounded-[24px] object-cover border border-slate-200"
                />
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-[24px] bg-slate-200 text-3xl font-bold text-slate-700">
                  {profile?.first_name?.[0] || 'S'}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Student</p>
                <h2 className="text-2xl font-bold text-slate-900">{profile?.first_name} {profile?.last_name}</h2>
                <p className="text-sm text-slate-500">{profile?.admissionNumber || profile?.admission_number}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Class</p>
                <p className="mt-1 font-semibold text-slate-900">{profile?.class_name || 'N/A'}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Parent contact</p>
                <p className="mt-1 font-semibold text-slate-900">{profile?.parent_name || 'N/A'}</p>
                <p className="text-sm text-slate-500">{profile?.parent_phone || profile?.parent_email || 'No contact available'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">What to do next</h3>
            <p className="mt-3 text-sm text-slate-500">
              View the latest results for your child or return to their profile details at any time.
            </p>
            <Link
              to="/parent/result"
              className="mt-6 inline-flex items-center justify-center rounded-[12px] bg-blue-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
            >
              View Result
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
