export const debug = {
  log: (...args) => {
    if (window._DEBUG_MODE) {
      console.log('[Debug]', ...args);
    }
  },
  error: (...args) => {
    // Always log errors, even in production
    console.error('[Error]', ...args);
  },
  request: (...args) => {
    // Always log request issues
    console.warn('[Request]', ...args);
  },
};
