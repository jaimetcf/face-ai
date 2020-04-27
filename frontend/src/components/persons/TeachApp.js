import React, { useState } from 'react';

import SimServer     from '../common/SimServer';
import PersonsList   from './PersonsList';
import FixedButton   from '../common/FixedButton';
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
	  <FixedButton position='right'>+</FixedButton>
    </div>
  );
};


export default  TeachApp;