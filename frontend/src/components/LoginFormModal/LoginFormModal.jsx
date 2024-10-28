import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import styles from './styles/LoginForm.module.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        closeModal();
      })
      .catch(() => {
        setErrors({ credential: 'The provided credentials were invalid' });
      });
  };
  const handleDemoLogin = (e) => {
    e.preventDefault();
    dispatch(
      sessionActions.login({ credential: 'Demo-lition', password: 'password' })
    ).then(() => {
      closeModal();
    });
  };

  return (
    <div className={styles.loginForm}>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit">Log In</button>
        <button onClick={handleDemoLogin} className={styles.demoButton}>
          Log in as Demo User
        </button>
        {errors.credential && (
          <p className={styles.error}>{errors.credential}</p>
        )}
      </form>
    </div>
  );
}

export default LoginFormModal;
