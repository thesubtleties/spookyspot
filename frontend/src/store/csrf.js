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
    options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    if (body) {
      options.body = JSON.stringify(body);
    }
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
