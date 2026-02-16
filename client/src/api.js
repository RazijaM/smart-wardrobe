import Cookies from 'js-cookie';

const BASE = 'http://localhost:3001/api';

export async function api(path, opts = {}) {
  const { method = 'GET', body, headers: customHeaders = {} } = opts;
  const token = Cookies.get('authData');
  const isFormData = body instanceof FormData;

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: token }),
    ...customHeaders,
  };
  if (isFormData) delete headers['Content-Type'];

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    ...(body != null && { body: isFormData ? body : (typeof body === 'string' ? body : JSON.stringify(body)) }),
  });

  if (!res.ok) throw new Error(res.statusText || 'Request failed');
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
