import React, { useState } from 'react';
import { Link }            from 'react-router-dom';

import SimServer     from '../common/SimServer';
import Panel         from '../common/Panel';
import Button        from '../common/Button';
import PersonsList   from './PersonsList';
import './TeachApp.css'

var  simServer = new SimServer();
var  personsList = simServer.fetchUserPersons();


const TeachApp = () => {
 
  // Initializes component state
  const [ state, setState ] = useState({
   	persons: personsList
  });

  if( state.length === 0 ) {
	return(
	  <h2>App knows no person yet!</h2>
	);
  }

//  return (
//    <React.Fragment>
//      {state && <PersonsList items={state} />}
//    </React.Fragment>
//  );

  return (
	<div>
	  <PersonsList items={state.persons}/>
  	<Panel>
      <Button to={`/person/add`}>Add Person</Button>
    </Panel>
    </div>
  );
};


export default  TeachApp;