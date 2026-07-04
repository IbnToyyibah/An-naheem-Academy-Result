import { Link, NavLink, Outlet } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, Printer, Settings, UserRound, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const adminLinks = [
  ['Dashboard', '/admin', LayoutDashboard],
  ['Students', '/admin/students', UserRound],
  ['Results', '/admin/results', BookOpen],
  ['Settings', '/admin/settings', Settings]
];

const parentLinks = [
  ['Dashboard', '/parent', LayoutDashboard],
  ['Profile', '/parent/profile', UserRound],
  ['Result', '/parent/result', Printer]
];

export default function Layout({ role }) {
  const { logout } = useAuth();
  const links = role === 'admin' ? adminLinks : parentLinks;
  const linkClass = ({ isActive }) =>
    [
      'flex items-center gap-2.5 rounded-[7px] px-3 py-[11px] font-bold text-[#344054] transition hover:bg-primary-soft hover:text-primary-dark',
      isActive ? 'bg-primary-soft text-primary-dark' : ''
    ].join(' ');

  return (
    <div className="grid min-h-screen min-w-0 grid-cols-[260px_1fr] max-[760px]:grid-cols-1">
      <aside className="sticky top-0 flex h-screen flex-col gap-[22px] border-r border-line bg-white p-[22px] max-[760px]:static max-[760px]:h-auto max-[760px]:p-4">
        <Link className="flex flex-col items-center justify-center gap-1.5 px-0 pb-3 pt-0.5 text-center" to={role === 'admin' ? '/admin' : '/parent'}>
          <span className="mb-1 grid h-[116px] w-[116px] place-items-center overflow-hidden">
            <img className="block h-full w-full object-contain" src="/Annaheem.jpeg.png" alt="Annaheem Academy logo" />
          </span>
          <span className="text-sm font-black leading-tight text-ink">AN-NAHEEM ACADEMY</span>
          <span className="text-[13px] font-extrabold text-muted">School Results</span>
        </Link>
        <nav className="grid gap-2 max-[760px]:grid-cols-2 max-[520px]:grid-cols-1">
          {links.map(([label, to, Icon]) => (
            <NavLink className={linkClass} key={to} to={to} end={to === '/admin' || to === '/parent'}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="mt-auto flex w-full items-center gap-2.5 rounded-[7px] border-0 bg-transparent px-3 py-[11px] font-bold text-[#344054] transition hover:bg-primary-soft hover:text-primary-dark" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>
      <main className="min-w-0 overflow-x-hidden p-7 max-[760px]:p-4 max-[520px]:p-3">
        <Outlet />
      </main>
    </div>
  );
}
