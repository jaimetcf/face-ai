import React  from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import TeachApp      from './components/persons/TeachApp';
import FindFaces     from './components/photos/FindFaces';
import Button        from './components/common/Button';
import './App.css';


const App = (props) => {

  // Shows the sidenav menu
  const openNav = () => 
  {
  	document.getElementById('menuSidenav').style.width = "150px";
	  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }

  // Hides the sidenav menu
  const closeNav = () => 
  {
	  document.getElementById('menuSidenav').style.width = "0";
	  document.body.style.backgroundColor = "white";
  }

  return (
      <Router>
        <div className='app'>
          <h1 className='app-header'>face.ai</h1>
          <ul>
            <Link to={'/'} className='app-link'>
              <Button type="button">Find faces in image/video</Button>         
            </Link>
            <Link to={'/teachapp'} className='app-link'>
              <Button type="button">Teach App</Button>         
            </Link>
 	        </ul>
          <hr />
          <Switch>
            <Route path='/'           component={FindFaces} />
            <Route path='/teachapp'   component={TeachApp} />
          </Switch>
        </div>
      </Router>
  );
  
};

export default App;
