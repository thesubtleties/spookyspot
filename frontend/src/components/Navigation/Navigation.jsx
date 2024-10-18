import React from 'react';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LogoWithText from './LogoWithText';
import styles from './Navigation.module.css'; // We'll create this file

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className={styles.navigation}>
      <div className={styles.logoContainer}>
        <LogoWithText />
      </div>
      {isLoaded && (
        <div className={styles.profileContainer}>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
