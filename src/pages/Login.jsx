import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LoaderCircle, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login({ role }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', admissionNumber: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isAdmin = role === 'admin';

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const credentials = isAdmin
        ? { username: form.username.trim(), password: form.password }
        : { admissionNumber: form.admissionNumber.trim(), password: form.password.trim() };
      await login(role, credentials);
      navigate(isAdmin ? '/admin' : '/parent');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-[#edf8f6] via-[#f7f8fb] to-[#fff5ed] p-6 max-[520px]:p-3">
      <section className="w-full max-w-[360px] rounded-2xl border border-line bg-panel p-6 shadow-panel max-[520px]:p-4">
        <div className="mb-5 flex items-center gap-3">
          <GraduationCap className="text-primary" size={32} />
          <div>
            <h1 className="text-base font-bold text-slate-800">{isAdmin ? 'Admin Login' : 'Parent Login'}</h1>
            <p className="text-lg font-black text-blue-900 uppercase tracking-wide max-[360px]:text-base">AN-NAHEEM ACADEMY</p>
          </div>
        </div>

        <form onSubmit={submit} className="grid gap-3">
          {isAdmin ? (
            <label className="grid gap-[5px] font-bold text-xs text-[#344054]">
              Username
              <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </label>
          ) : (
            <label className="grid gap-[5px] font-bold text-xs text-[#344054]">
              Admission Number
              <input required placeholder="ANA/JSS1/001a" value={form.admissionNumber} onChange={(e) => setForm({ ...form, admissionNumber: e.target.value })} />
            </label>
          )}
          <label className="grid gap-[5px] font-bold text-xs text-[#344054]">
            Password
            <input type="password" required minLength={isAdmin ? 6 : 4} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          {!isAdmin && <p className="m-0 text-xs font-semibold text-muted">Use admission number and default password <span className="font-bold">0823</span>.</p>}
          {error && <p className="m-0 text-xs font-bold text-accent">{error}</p>}
          <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" size={16} /> : <LockKeyhole size={16} />}
            <span>Login</span>
          </button>
        </form>

        <Link to={isAdmin ? '/parent-login' : '/admin-login'} className="mt-4 block text-center text-xs font-bold text-primary hover:underline">
          {isAdmin ? 'Switch to Parent Login' : 'Switch to Admin Login'}
        </Link>
      </section>
    </main>
  );
}
