import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AppContext }  from '../../AppContext';
import './NavLinks.css';

const NavLinks = props => {

  const appContext = useContext(AppContext);

  return (
    <ul className="nav-links">
      {!appContext.userIn && (
      <li>
        <NavLink to='/signup'>
          Sign up
        </NavLink>
      </li>
      )}
      {!appContext.userIn && (
      <li>
        <NavLink to='/signin'>
          Login
        </NavLink>
      </li>
      )}
      {appContext.userIn && (
      <li>
        <NavLink to='/findfaces'>
          Find faces
        </NavLink>
      </li>
      )}
      {appContext.userIn && (
      <li>
        <NavLink to='/teachapp'>
          Teach app
        </NavLink>
      </li>
      )}
      {appContext.userIn && (
      <li>
        <button onClick={appContext.logoutFun}>Log out</button>
      </li>
      )}
    </ul>
  );
};

export default  NavLinks;
