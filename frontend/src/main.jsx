import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';
import { Modal, ModalProvider } from './context/Modal';

const store = configureStore();

async function initializeApp() {
  // Always restore CSRF
  await restoreCSRF();

  // Only set debug tools in development
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
}

initializeApp();
