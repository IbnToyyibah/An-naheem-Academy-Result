import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, assetUrl } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  FiPhone,
  FiMail,
  FiCalendar,
  FiHash,
  FiUser,
  FiHome,
  FiAward,
  FiShield,
  FiStar
} from 'react-icons/fi';

export default function ParentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setMessage('');

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
      .catch((error) => {
        if (!active) return;
        setProfile(user || null);
        const forbiddenMessage = 'You do not have access to this resource';
        if (error?.status === 403 || error?.message === forbiddenMessage) {
          setMessage('');
        } else {
          setMessage(error.message || 'Unable to load profile information.');
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
        <h1 className="text-2xl font-bold tracking-tight text-blue-800">Student Profile</h1>
        <p className="max-w-2xl text-md text-bold text-black">Your child's academic identity, family contact details, and classroom information.</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-950/5 via-white to-slate-950/5 p-6 shadow-lg"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 -translate-x-1/3 -translate-y-1/3 rounded-full bg-sky-200/20 blur-3xl" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-36 w-36 -translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-200/20 blur-3xl" />

        {loading ? (
          <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
            Loading student profile...
          </div>
        ) : message ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center text-red-700">{message}</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-5" />
              <div className="relative flex flex-col items-center gap-5 text-center">
                <div className="relative">
                  {profile?.passport_path ? (
                    <img
                      src={assetUrl(profile.passport_path)}
                      alt="Student passport"
                      className="h-28 w-28 rounded-3xl border-4 border-white object-cover shadow-xl shadow-slate-200/50"
                    />
                  ) : (
                    <div className="grid h-28 w-28 place-items-center rounded-3xl bg-slate-100 text-4xl font-bold text-slate-700 shadow-inner">
                      {profile?.first_name?.[0] || 'S'}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Student</p>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-900">{profile?.first_name || 'N/A'} {profile?.last_name || ''}</h2>
                  <p className="mt-2 text-sm text-slate-500">{profile?.class_name ? `Class ${profile.class_name}` : 'Class information not available'}</p>
                </div>

                <div className="grid w-full grid-cols-2 gap-3 text-left">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Admission</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{profile?.admissionNumber || profile?.admission_number || 'N/A'}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Status</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">Active</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3 text-slate-700">
                    <FiUser className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Gender</p>
                      <p className="mt-1 font-semibold text-slate-900">{profile?.gender || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3 text-slate-700">
                    <FiCalendar className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Date of Birth</p>
                      <p className="mt-1 font-semibold text-slate-900">{profile?.date_of_birth || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Parent Contact</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">Primary Guardian</h3>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                    <FiShield className="h-4 w-4 text-sky-500" /> Verified Account
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <FiPhone className="mt-1 h-5 w-5 text-slate-500" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Phone</p>
                        <p className="mt-1 font-semibold text-slate-900">{profile?.parent_phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <FiMail className="mt-1 h-5 w-5 text-slate-500" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Email</p>
                        <p className="mt-1 font-semibold text-slate-900">{profile?.parent_email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Student details</p>
                    <h4 className="mt-2 text-xl font-semibold text-slate-900">Academic snapshot</h4>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                    <FiStar className="h-4 w-4" /> Excellent
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Registration</p>
                    <p className="mt-2 font-semibold text-slate-900">{profile?.admissionNumber || profile?.admission_number || 'N/A'}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Class</p>
                    <p className="mt-2 font-semibold text-slate-900">{profile?.class_name || 'N/A'}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Section</p>
                    <p className="mt-2 font-semibold text-slate-900">{profile?.stream || 'N/A'}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">School</p>
                    <p className="mt-2 font-semibold text-slate-900">Annaheem Academy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
