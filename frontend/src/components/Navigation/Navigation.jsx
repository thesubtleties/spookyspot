import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LogoWithText from './LogoWithText';
import styles from './styles/Navigation.module.css';
import AddSpotButton from './AddSpotButton';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className={styles.navigation}>
      <div className={styles.logoContainer}>
        <LogoWithText />
      </div>
      {isLoaded && sessionUser && (
        <div className={styles.addSpotButtonContainer}>
          <AddSpotButton />
        </div>
      )}
      {isLoaded && (
        <div className={styles.profileContainer}>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
