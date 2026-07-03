import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Students from './pages/admin/Students.jsx';
import Results from './pages/admin/Results.jsx';
import Settings from './pages/admin/Settings.jsx';
import ParentDashboard from './pages/parent/ParentDashboard.jsx';
import ParentProfile from './pages/parent/ParentProfile.jsx';
import ParentResult from './pages/parent/ParentResult.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin-login" replace />} />
      <Route path="/login" element={<Navigate to="/admin-login" replace />} />
      <Route path="/admin-login" element={<Login role="admin" />} />
      <Route path="/admin/login" element={<Navigate to="/admin-login" replace />} />
      <Route path="/parent-login" element={<Login role="parent" />} />
      <Route path="/parent/login" element={<Navigate to="/parent-login" replace />} />

      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<Layout role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/results" element={<Results />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="parent" />}>
        <Route element={<Layout role="parent" />}>
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/parent/profile" element={<ParentProfile />} />
          <Route path="/parent/result" element={<ParentResult />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/admin-login" replace />} />
    </Routes>
  );
}
