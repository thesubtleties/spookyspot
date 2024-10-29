import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import Cookies from 'js-cookie';
import { Modal, ModalProvider } from './context/Modal';
import { restoreCSRF } from './store/csrf';
import App from './App';
async function initializeApplication() {
  try {
    // ALWAYS get a fresh token before rendering
    await restoreCSRF();
    const token = Cookies.get('XSRF-TOKEN');

    if (!token) {
      throw new Error('Failed to initialize CSRF token');
    }

    console.log('App Init:', {
      hasToken: !!token,
      allCookies: Cookies.get(),
    });

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <ModalProvider>
          <Provider store={store}>
            <App />
            <Modal />
          </Provider>
        </ModalProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Critical initialization error:', error);
  }
}
initializeApplication();
