import { useState } from 'react';
import { api } from '../../services/api.js';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    try {
      await api('/auth/parent/password', { method: 'PATCH', body: JSON.stringify(form), authRedirect: false });
      setForm({ currentPassword: '', newPassword: '' });
      setMessage('Password changed successfully');
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <section>
      <header className="page-title"><h1>Change Password</h1></header>
      <form className="panel form narrow" onSubmit={submit}>
        <label>Current Password<input type="password" required value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} /></label>
        <label>New Password<input type="password" required minLength="6" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} /></label>
        {message && <p className="success">{message}</p>}
        <button className="primary">Update Password</button>
      </form>
    </section>
  );
}
