import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';
import { Modal, ModalProvider } from './context/Modal';
import { debug } from './components/utils/debug';

// main.jsx
const store = configureStore(); // This is fine at the top level
window._DEBUG_MODE = true; // Enable debugging
async function initializeApplication() {
  try {
    // Check if we have a token first
    let token = Cookies.get('XSRF-TOKEN');

    // Only restore if we don't have a token
    if (!token) {
      console.log('No existing CSRF token, getting fresh one');
      await restoreCSRF();
      token = Cookies.get('XSRF-TOKEN');
    } else {
      console.log('Using existing CSRF token');
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
