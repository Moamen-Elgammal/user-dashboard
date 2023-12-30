import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Header from './layout/Header';
import Register from './pages/Register';
import AllUsers from './pages/AllUsers';
import Identefier from './pages/Identefier';
import Thank from './pages/Thank';

import AuthContxt from './store/auth-context';

function App() {
  const ctx = useContext(AuthContxt);
  return (
    <>
      <Header />
      <Switch>
        <Route path='/' exact>
          <Redirect to='/Register'></Redirect>
        </Route>
        <Route path='/Register'>
          <Register />
        </Route>
        <Route path='/AllUsers'>
          <AllUsers />
        </Route>
        {ctx.isLogenIn && (
          <Route path='/identefier'>
            <Identefier />
          </Route>
        )}
        {ctx.isLogenIn && (
          <Route path='/Thank'>
            <Thank />
          </Route>
        )}
      </Switch>
    </>
  );
}

export default App;
