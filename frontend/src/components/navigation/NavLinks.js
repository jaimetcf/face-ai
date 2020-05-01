import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AppContext }  from '../../AppContext';
import './NavLinks.css';

const NavLinks = props => {

  const appContext = useContext(AppContext);

  return (
    <ul className="nav-links">
      {!appContext.userLoggedIn && (
      <li>
        <NavLink to='/signup'>
          Sign up
        </NavLink>
      </li>
      )}
      {!appContext.userLoggedIn && (
      <li>
        <NavLink to='/signin'>
          Login
        </NavLink>
      </li>
      )}
      {appContext.userLoggedIn && (
      <li>
        <NavLink to='/teachapp'>
          Teach app
        </NavLink>
      </li>
      )}
      {appContext.userLoggedIn && (
      <li>
        <NavLink to='/logout'>
          Logout
        </NavLink>
      </li>
      )}
    </ul>
  );
};

export default  NavLinks;
