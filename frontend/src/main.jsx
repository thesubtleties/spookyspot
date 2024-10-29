import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Modal, ModalProvider } from './context/Modal';
import { restoreCSRF } from './store/csrf';
import configureStore from './store';
import App from './App';

const store = configureStore();

async function initializeApplication() {
  try {
    console.log('Starting initialization...');

    // Try to restore CSRF but don't block rendering on it
    try {
      await restoreCSRF();
    } catch (error) {
      console.error('CSRF restore failed:', error);
    }

    // Render the app regardless of CSRF status
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
