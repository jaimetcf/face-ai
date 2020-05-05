import React, { useRef, useContext, useState, useEffect } from 'react';
import { useParams, Link }                                from 'react-router-dom';

import { AppContext }    from '../../AppContext';
import Panel             from '../common/Panel';
import Button            from '../common/Button';
import WaitingSpinner    from '../common/WaitingSpinner';
import ErrorModal        from '../common/ErrorModal';
import PhotosList        from '../photo/PhotosList';

import './Person.css';


const UpdatePerson = (props) => {

  // Gets the database person id and name from the caller component (TeachApp)
  const personId = useParams().id;  
  const personName = useParams().name;  
  console.log('personId:  ' + personId );
  console.log('personName:' + personName );
 
  // Needed for recovering domain name
  const appContext = useContext(AppContext);


  // ------------------------------ STATE ---------------------------------
  // This state goes true whenever a request was sent to the 
  // backend and the response was not received yet
  const [ waiting, setWaiting ] = useState(false);

  // This state saves any error ocurred when communicating with the backend
  const [ error, setError ] = useState('');

  // This state saves the photos list associated with the current person
  const [ photos, setPhotos ] = useState([]);
  
  // Enables navigation back to /teachapp, after Add person is successful
  const backToTeachApp = useRef();


  // ---------------------------- FUNCTIONS -------------------------------
  // Fetches the backend for photos associated with the personId passed as 
  // parameter for this component      
  const reloadPhotos = () => {
    
    setWaiting(true); // Shows waiting spinner on screen

    // Sends POST request to backend
    fetch( appContext.backendDomain + '/photo/readpersonphotos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personId: personId }),

    }).then( async (res) => {   // Received a response 2xx, 4xx, or 5xx

        const response = await res.json(); // Converts string to json object

        if(res.ok) {   // Status = 2xx
          setWaiting(false);                  // Hides waiting spinner
          setPhotos(response);                // Saves photos list in UpdatePerson state
          console.log('photos =>');
          console.log(response);
        }
        else {         // Status IS NOT 2xx

          // Forwards error message comming from backend
          // to be treated in the catch block, below
          throw new Error(response.message);
        }

    }).catch( (err) => {  // Communication error or response status is not 2xx
        setWaiting(false);      // Hides waiting spinner
        console.log(err.message);
        setError(err.message);  // Shows error modal with error msg on screen  
    });

  }

  useEffect( reloadPhotos, [] );

  // Removes this personId from the database, and returns to the /teachapp screen
  const removePerson = async () => {

    setWaiting(true); // Shows waiting spinner on screen

    // Sends POST request to backend
    fetch( appContext.backendDomain + '/person/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personId: personId }),

    }).then( async (res) => {   // Received a response 2xx, 4xx, or 5xx

        const response = await res.json(); // Converts string to json object

        if(res.ok) {   // Status = 2xx
          setWaiting(false);              // Hides waiting spinner
          setPhotos(null);                // Saves photos list in UpdatePerson state

          console.log(response);

          // Sends a click event to this link to navigate back to /teachapp
          backToTeachApp.current.click(); 
        }
        else {         // Status IS NOT 2xx

          // Forwards error message comming from backend
          // to be treated in the catch block, below
          throw new Error(response.message);
        }

    }).catch( (err) => {  // Communication error or response status is not 2xx
        setWaiting(false);      // Hides waiting spinner
        console.log(err.message);
        setError(err.message);  // Shows error modal with error msg on screen  
    });
  }

  // Removes the photoId passed as parameter from the database
  const  deletePhoto = (photoId) => {

    setWaiting(true); // Shows waiting spinner on screen
  
    // Sends POST request to backend
    fetch( appContext.backendDomain + '/photo/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId: photoId }),
  
    }).then( async (res) => {   // Received a response 2xx, 4xx, or 5xx
  
      const response = await res.json(); // Converts string to json object
  
        if(res.ok) {   // Status = 2xx
          setWaiting(false);              // Hides waiting spinner  
          console.log(response);
          reloadPhotos();
        }
        else {         // Status IS NOT 2xx
  
          // Forwards error message comming from backend
          // to be treated in the catch block, below
          throw new Error(response.message);
        }
  
    }).catch( (err) => {  // Communication error or response status is not 2xx
      setWaiting(false);      // Hides waiting spinner
      console.log(err.message);
      setError(err.message);  // Shows error modal with error msg on screen  
    });
  }
  
  // Updates component error state
  const clearError = () => {
    setError(null);
  };
  

  // ---------------------------- RENDERING -------------------------------
  return (
	  <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {waiting && (
        <div className="center">
          <WaitingSpinner />
        </div>
      )}
      {!waiting && photos && (
        <div>
          <div style={{textAlign: 'center'}}>
            <h2>{personName}</h2>
          </div>
    	    <PhotosList items={photos} deleteFun={deletePhoto}/>
  	      <Panel style={{bottom: 0}}>
            <Link to={`/teachapp`}><Button>Back</Button></Link>
            <Link to={`/photo/add/${personId}/${personName}`}><Button>Upload Photo</Button></Link>
            <Button onClick={removePerson}>Remove Person</Button>
          </Panel>
        </div>
      )}
      <Link     // This link is invisible and used to navigate back to the /teachapp screen
        to='/teachapp'
        ref={backToTeachApp}>
      </Link>
    </React.Fragment>
  );
};


export default  UpdatePerson;