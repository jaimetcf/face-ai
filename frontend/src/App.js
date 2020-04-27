import React  from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import MainNavigation   from './components/navigation/MainNavigation';
import TeachApp         from './components/persons/TeachApp';
import Person           from './components/persons/Person';
import FindFaces        from './components/photos/FindFaces';
import Button           from './components/common/Button';


const App = (props) => {

  return (
      <Router>
        <MainNavigation />
        <main>
          <Switch>
            <Route path='/findfaces'           component={FindFaces} />
            <Route path='/teachapp'            component={TeachApp} />
            <Route path='/person/:personId'    component={Person} />
          </Switch>
        </main>
      </Router>
  );
  
};

export default App;
