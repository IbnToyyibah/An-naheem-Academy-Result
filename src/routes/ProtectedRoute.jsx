import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={role === 'admin' ? '/admin-login' : '/parent-login'} replace />;
  if (role && user.role !== role) return <Navigate to={role === 'admin' ? '/admin-login' : '/parent-login'} replace />;
  return <Outlet />;
}
