import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { TbGhost2 } from 'react-icons/tb';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import styles from './styles/ProfileButton.module.css';
import { useNavigate } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/');
  };
  const goToManageSpots = () => {
    closeMenu();
    navigate('/profile');
  };

  const ulClassName = `${styles.profileDropdown} ${
    showMenu ? '' : styles.hidden
  }`;

  return (
    <>
      <button className={styles.userButton} onClick={toggleMenu}>
        <TbGhost2 className={styles.ghost} />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li className={styles.name}>Hello, {user.firstName}</li>
            <li className={styles.email}>{user.email}</li>
            <li className={styles.buttonLi}>
              <button
                className={`${styles.manageButton} ${styles.bloodyButton}`}
                onClick={goToManageSpots}
              >
                Manage Spots
              </button>
            </li>
            <li className={styles.buttonLi}>
              <button
                className={`${styles.logoutButton} ${styles.bloodyButton}`}
                onClick={logout}
              >
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              className={styles.menuButton}
              modalComponent={<SignupFormModal />}
            />
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              className={styles.menuButton}
              modalComponent={<LoginFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
