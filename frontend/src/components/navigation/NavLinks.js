import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import './NavLinks.css';

const NavLinks = props => {

  return (
    <ul className="nav-links">
      <li>
        <NavLink to='/findfaces'>
          Find faces
        </NavLink>
      </li>
      <li>
        <NavLink to='/teachapp'>
          Teach app
        </NavLink>
      </li>
      <li>
        <NavLink to='/logout'>
          Logout
        </NavLink>
      </li>
    </ul>
  );
};

export default  NavLinks;
