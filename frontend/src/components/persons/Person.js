import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import SimServer      from '../common/SimServer';
import PhotosList     from '../photos/PhotosList';
import FixedButton    from '../common/FixedButton';

var  simServer = new SimServer();
var  personsList = simServer.fetchUserPersons();


const Person = (props) => {

  const personId = useParams().personId;
 
  // Initializes component state
  const [ state, setState ] = useState({
   	photos: personsList[personId].photos
  });

  return (
	<div>
	  <PhotosList items={personsList[personId].photos}/>
      <Link to={`/teachapp`}>
    	  <FixedButton position='right'>Back</FixedButton>
      </Link>
    </div>
  );
};


export default  Person;