import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import CreateSpotForm from '../CreateSpotForm/CreateSpotForm';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" className="home-link">
            <img src="/favicon.ico" alt="Favicon" className="navbar-favicon" />
          </NavLink>
        </li>
        {isLoaded && (
          <div className="nav-right">
            {sessionUser && (
              <li className="create-spot-link">
                <NavLink 
                  to="/spots/new"
                  className="create-button"
                >
                  Create a New Spot
                </NavLink>
              </li>
            )}
            <li className="profile-button">
              <ProfileButton user={sessionUser} />
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;