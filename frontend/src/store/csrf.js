export async function csrfFetch(
  endpoint,
  method = 'GET',
  body = null,
  headers = {}
) {
  console.log('csrfFetch called with:', {
    endpoint,
    method,
    body,
  });

  const options = {
    method,
    headers: {
      ...headers,
    },
    credentials: 'include',
  };

  if (method.toUpperCase() !== 'GET') {
    console.log('Setting up POST request headers');
    options.headers['Content-Type'] =
      options.headers['Content-Type'] || 'application/json';

    const token = Cookies.get('XSRF-TOKEN');
    console.log('XSRF-TOKEN from cookie:', token); // Debug log

    if (!token) {
      console.error('No XSRF-TOKEN found in cookies!');
      console.log('All cookies:', Cookies.get()); // See what cookies we do have
    }

    options.headers['XSRF-Token'] = token;

    if (body) {
      options.body = JSON.stringify(body);
    }

    // Log final headers
    console.log('Final request headers:', options.headers);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Making fetch request with:', {
    url,
    method: options.method,
    headers: options.headers,
    body: options.body,
  });

  const res = await window.fetch(url, options);
  console.log('Fetch response:', res.status);

  if (res.status >= 400) throw res;

  return res;
}
