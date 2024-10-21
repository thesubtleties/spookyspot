import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import styles from './LogoWithText.module.css';

function LogoWithText() {
  return (
    <NavLink to="/" className={styles.logoLink}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="SpookySpot Logo" className={styles.logo} />
        <span className={styles.logoText}>SpookySpot</span>
      </div>
    </NavLink>
  );
}

export default LogoWithText;
