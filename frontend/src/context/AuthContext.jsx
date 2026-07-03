import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

function clearStoredAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function readTokenPayload(token) {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function inferRoleFromToken(tokenUser) {
  if (tokenUser?.role) return tokenUser.role;
  if (tokenUser?.studentId || tokenUser?.admissionNumber) return 'parent';
  if (tokenUser?.email) return 'admin';
  return null;
}

function readStoredUser() {
  try {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const tokenUser = token ? readTokenPayload(token) : null;
    const inferredRole = inferRoleFromToken(tokenUser);
    const tokenExpired = tokenUser?.exp && tokenUser.exp * 1000 <= Date.now();

    if (!token || !tokenUser || !inferredRole || tokenExpired) {
      clearStoredAuth();
      return null;
    }

    const nextUser = {
      ...tokenUser,
      ...storedUser,
      id: storedUser?.id || tokenUser?.id,
      role: inferredRole
    };

    if (inferredRole === 'parent') {
      nextUser.studentId = tokenUser.studentId || storedUser?.studentId;
      nextUser.admissionNumber = tokenUser.admissionNumber || storedUser?.admissionNumber;
    }

    if (inferredRole === 'admin') {
      nextUser.email = tokenUser.email || storedUser?.email;
    }

    return nextUser;
  } catch {
    clearStoredAuth();
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  async function login(role, credentials) {
    clearStoredAuth();
    setUser(null);
    const path = role === 'admin' ? '/auth/admin/login' : '/auth/parent/login';
    const data = await api(path, { method: 'POST', body: JSON.stringify(credentials) });
    const tokenUser = readTokenPayload(data.token);
    const normalizedRole = tokenUser?.role || data.user?.role || role;
    if (!normalizedRole) {
      throw new Error('Login returned the wrong account type. Please try again.');
    }

    const nextUser = {
      ...(data.user || {}),
      ...tokenUser,
      role: normalizedRole,
      id: data.user?.id || data.user?._id || tokenUser?.id
    };

    if (normalizedRole === 'parent') {
      nextUser.studentId = tokenUser?.studentId || data.user?.studentId;
      nextUser.admissionNumber = tokenUser?.admissionNumber || data.user?.admissionNumber;
    }

    // persist results payload when provided by the server
    if (data.user?.results) {
      nextUser.results = data.user.results;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
    console.debug('Auth login successful', { nextUser, tokenPayload: readTokenPayload(data.token) });
  }

  function logout() {
    clearStoredAuth();
    setUser(null);
  }

  useEffect(() => {
    function handleLogout() {
      setUser(null);
    }

    function handleStorageChange(event) {
      if (event.key === 'token' || event.key === 'user') {
        setUser(readStoredUser());
      }
    }

    window.addEventListener('auth:logout', handleLogout);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
