const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const FILE_URL = (import.meta.env.VITE_FILE_URL || '').replace(/\/$/, '');

export function assetUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (FILE_URL) return `${FILE_URL}${path}`;

  // Ensure the path starts with a slash to avoid malformed URLs
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  try {
    return `${new URL(API_URL, window.location.origin).origin}${normalizedPath}`;
  } catch {
    return normalizedPath;
  }
}

function redirectToLogin(role) {
  const target = role === 'parent' ? '/#/parent-login' : '/#/admin-login';
  if (window.location.hash !== target) {
    window.location.assign(target);
  }
}

export async function api(path, options = {}) {
  const shouldRedirectOnAuthError = options.authRedirect !== false;
  const { authRedirect: _authRedirect, ...fetchOptions } = options;
  const token = localStorage.getItem('token');
  const headers = fetchOptions.body instanceof FormData ? {} : { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      headers: { ...headers, ...fetchOptions.headers }
    });
  } catch {
    throw new Error('Cannot reach the server. Make sure the backend is running.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (shouldRedirectOnAuthError && (response.status === 401 || response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:logout'));
      if (path.startsWith('/parent')) {
        redirectToLogin('parent');
      } else if (path.startsWith('/admin')) {
        redirectToLogin('admin');
      }
    }

    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    throw error;
  }
  return data;
}
