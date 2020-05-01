import React, { useState, useCallback }  from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import MainNavigation   from './components/navigation/MainNavigation';
import { AppContext }   from './AppContext';
import Signup           from './components/user/Signup';
import Signin           from './components/user/Signin';
import Logout           from './components/user/Logout';
import TeachApp         from './components/person/TeachApp';
import AddPerson        from './components/person/AddPerson';
import UpdatePerson     from './components/person/UpdatePerson';


const App = (props) => {

  const [ userIn, setUserIn ] = useState(false);

  const login = useCallback(() => {setUserIn(true);}, [] );

  const logout = useCallback(() => {setUserIn(false);}, [] );

  let routes;

  if (userIn) {
    routes = (
      <Switch>
        <Route path='/teachapp'          component={TeachApp} />
        <Route path='/person/add'        component={AddPerson} />
        <Route path='/person/update/:id' component={UpdatePerson} />
        <Route path='/logout'            component={Logout}/>
        <Redirect to='/' />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path='/signup'            component={Signup}   />
        <Route path='/signin'            component={Signin}   />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AppContext.Provider value={{
      userLoggedIn: userIn,
      loginFun: login,
      logoutFun: logout
      }}>
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AppContext.Provider>
  );
  
};

export default App;
