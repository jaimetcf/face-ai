import React  from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import MainNavigation   from './components/navigation/MainNavigation';
import Signup           from './components/user/Signup';
import Signin           from './components/user/Signin';
import TeachApp         from './components/person/TeachApp';
import AddPerson        from './components/person/AddPerson';
import UpdatePerson     from './components/person/UpdatePerson';


const App = (props) => {

  return (
      <Router>
        <MainNavigation />
        <main>
          <Switch>
            <Route path='/signup'            component={Signup}   />
            <Route path='/signin'            component={Signin}   />
            <Route path='/teachapp'          component={TeachApp} />
            <Route path='/person/add'        component={AddPerson} />
            <Route path='/person/update/:id' component={UpdatePerson} />
            <Redirect to='/' />
          </Switch>
        </main>
      </Router>
  );
  
};

export default App;
