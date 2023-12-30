import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';

import classes from './Header.module.css';
import AuthContxt from '../store/auth-context';
const Header = () => {
  const ctx = useContext(AuthContxt);
  const history = useHistory();
  const logOutHandeler = () => {
    ctx.logOut();
    history.replace('/');
  };
  return (
    <header className={classes.header}>
      <div>
        <h3 className={classes.logo}>Users Manger</h3>
      </div>
      <nav>
        <ul>
          {!ctx.isLogenIn && (
            <li>
              <NavLink activeClassName={classes.active} to='/Register'>
                Register
              </NavLink>
            </li>
          )}
          {ctx.isLogenIn && (
            <li>
              <NavLink activeClassName={classes.active} to='/AllUsers'>
                AllUsers
              </NavLink>
            </li>
          )}
          {ctx.isLogenIn && (
            <li>
              <button onClick={logOutHandeler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
