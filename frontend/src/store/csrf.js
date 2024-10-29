import { debug } from '../components/utils/debug';
import Cookies from 'js-cookie';
const API_BASE_URL =
  import.meta.env.MODE === 'production'
    ? 'https://spookyspot.sbtl.dev/api' // Your production URL
    : '/api'; // Empty string for development (will use relative URLs)
export async function csrfFetch(
  endpoint,
  method = 'GET',
  body = null,
  headers = {}
) {
  debug.request({
    type: 'request-start',
    endpoint,
    method,
    hasToken: !!Cookies.get('XSRF-TOKEN'),
    tokenValue: Cookies.get('XSRF-TOKEN'),
    allCookies: Cookies.get(),
  });

  const options = {
    method,
    headers: {
      ...headers,
    },
    credentials: 'include',
  };

  if (method.toUpperCase() !== 'GET') {
    const token = Cookies.get('XSRF-TOKEN');
    console.log('Making POST request:', {
      endpoint,
      token,
      allCookies: Cookies.get(),
      headers: options.headers,
    });

    if (!token) {
      debug.error({
        type: 'csrf-missing',
        cookies: Cookies.get(),
        timestamp: new Date().toISOString(),
      });
    }

    options.headers['Content-Type'] =
      options.headers['Content-Type'] || 'application/json';

    // Use lowercase header name
    options.headers['xsrf-token'] = token;

    if (body) {
      options.body = JSON.stringify(body);
    }

    debug.request({
      type: 'request-details',
      url: `${API_BASE_URL}${endpoint}`,
      headers: options.headers,
      hasToken: !!token,
    });
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const res = await window.fetch(url, options);

  debug.request({
    type: 'response',
    status: res.status,
    endpoint,
    method,
    hasToken: !!Cookies.get('XSRF-TOKEN'),
  });

  if (res.status >= 400) {
    debug.error({
      type: 'request-failed',
      status: res.status,
      endpoint,
      method,
      hasToken: !!Cookies.get('XSRF-TOKEN'),
    });
    throw res;
  }

  return res;
}
export function restoreCSRF() {
  return csrfFetch('/csrf/restore');
}
