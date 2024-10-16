import Cookies from 'js-cookie';
const API_BASE_URL = '/api';

export async function csrfFetch(
  endpoint,
  method = 'GET',
  body = null,
  headers = {}
) {
  const options = {
    method,
    headers: {
      ...headers,
    },
  };

  if (method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] =
      options.headers['Content-Type'] || 'application/json';
    options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    if (body) {
      options.body = JSON.stringify(body);
    }
  }
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await window.fetch(url, options);

  if (res.status >= 400) throw res;

  return res;
}

export function restoreCSRF() {
  return csrfFetch('/csrf/restore');
}
