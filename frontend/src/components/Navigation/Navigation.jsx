import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li>
        <NavLink to="/" className="home-link">
          <img src="/favicon.ico" alt="Favicon" className="navbar-favicon" />
        </NavLink>
      </li>
      {isLoaded && (
        <>
          <li className="profile-button">
            <ProfileButton user={sessionUser} />
          </li>
        </>
      )}
    </ul>
  );
}

export default Navigation;
