import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import SimServer      from '../common/SimServer';
import Panel          from '../common/Panel';
import Button         from '../common/Button';
import PhotosList     from '../photo/PhotosList';
import './Person.css';

var  simServer = new SimServer();
var  peopleList = simServer.fetchUserPeople();


const UpdatePerson = (props) => {

  const personId = useParams().id;
 
  // Initializes component state
  const [ photos, setPhotos ] = useState(peopleList[personId].photos);

  return (
	<div>
	  <PhotosList items={photos}/>
  	<Panel>
      <Link to={`/teachapp`}><Button>Back</Button></Link>
      <Button>Upload Photo</Button>
      <Button>Delete Person</Button>
    </Panel>
    </div>
  );
};


export default  UpdatePerson;