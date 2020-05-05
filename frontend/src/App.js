import React, { useState, useCallback }  from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import MainNavigation   from './components/navigation/MainNavigation';
import { AppContext }   from './AppContext';
import User             from './components/user/User';
import Signup           from './components/user/Signup';
import Signin           from './components/user/Signin';
import FindFaces        from './components/photo/FindFaces';
import TeachApp         from './components/person/TeachApp';
import AddPerson        from './components/person/AddPerson';
import UpdatePerson     from './components/person/UpdatePerson';
import AddPhoto         from './components/photo/AddPhoto';


const currentUser = new User();


const App = (props) => {

  const [ userIn, setUserIn ] = useState(currentUser.getState());

  const login = useCallback( () => {setUserIn(true);}, [] );

  const logout = useCallback(() => {setUserIn(false);}, [] );

  let routes;

  if (userIn) {
    routes = (
      <Switch>
        <Route path='/findfaces'               component={FindFaces} />
        <Route path='/teachapp'                component={TeachApp} />
        <Route path='/person/add'              component={AddPerson} />
        <Route path='/person/update/:id/:name' component={UpdatePerson} />
        <Route path='/photo/add/:id/:name'     component={AddPhoto} />
        <Route path='/logout'     />
        <Redirect to='/findfaces' />
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
      backendDomain: 'http://localhost:5000',
      userIn: userIn,
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
