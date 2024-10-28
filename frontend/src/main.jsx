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

async function initializeApplication() {
  debug.log('App initializing');
  try {
    await restoreCSRF();
    const token = Cookies.get('XSRF-TOKEN');
    if (!token) {
      throw new Error('CSRF initialization failed');
    }

    if (import.meta.env.MODE !== 'production') {
      window.csrfFetch = csrfFetch;
      window.store = store;
      window.sessionActions = sessionActions;
    }

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
    console.error('Failed to initialize application:', error);
  }
}

initializeApplication();
