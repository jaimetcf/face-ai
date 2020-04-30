import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import SimServer      from '../common/SimServer';
import Panel         from '../common/Panel';
import Button        from '../common/Button';
import PhotosList     from '../photo/PhotosList';

var  simServer = new SimServer();
var  personsList = simServer.fetchUserPersons();


const UpdatePerson = (props) => {

  const personId = useParams().id;
 
  // Initializes component state
  const [ state, setState ] = useState({
   	photos: personsList[personId].photos
  });

  return (
	<div>
	  <PhotosList items={personsList[personId].photos}/>
  	<Panel>
      <Link to={`/teachapp`}>
        <Button>Back</Button>
      </Link>
      <Button>Upload Photo</Button>
      <Button>Delete Person</Button>
    </Panel>
    </div>
  );
};


export default  UpdatePerson;