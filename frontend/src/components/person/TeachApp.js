import React, { useContext, useState, useEffect } from 'react';

import { AppContext }  from '../../AppContext';
import User            from '../user/User';
import Panel           from '../common/Panel';
import Button          from '../common/Button';
import WaitingSpinner  from '../common/WaitingSpinner';
import ErrorModal      from '../common/ErrorModal';
import PeopleList      from './PeopleList';
import './TeachApp.css'


// The current user id will be used for querying the database
const currentUser = new User();  


const TeachApp = () => {
 
  // Needed for recovering domain name
  const appContext = useContext(AppContext);


  // ------------------------------ STATE ---------------------------------
  // This state goes true whenever a request was sent to the 
  // backend and the response was not received yet
  const [ waiting, setWaiting ] = useState(false);

  // This state saves any error ocurred when communicating with the backend
  const [ error, setError ] = useState('');

  // This state saves the person list associated with the current user
  const [ people, setPeople ] = useState([]);

  console.log('User:' + currentUser.getId() );


  // ---------------------------- FUNCTIONS -------------------------------
  // Fetches the backend for people associated with the current user (appContext.userId)      
  useEffect( () => {
    
    setWaiting(true); // Shows waiting spinner on screen

    // Sends POST request to backend
    fetch( appContext.backendDomain + '/person/readuserpeople', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.getId() }),

    }).then( async (res) => {   // Received a response 2xx, 4xx, or 5xx

        const response = await res.json(); // Converts string to json object

        if(res.ok) {   // Status = 2xx
          setWaiting(false);      // Hides waiting spinner
          setPeople(response);                // Saves people list in TeachApp state
          currentUser.setPeople(response);    // Saves people list in currentUser
          console.log('first photo:' + (currentUser.getPeople())[0].photos[0] );
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

  }, []);

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
      {!waiting && people && (
        <div>
	        <PeopleList items={people}/>
  	      <Panel style={{bottom: 0}}>
            <Button to={`/person/add`}>Add Person</Button>
          </Panel>
        </div>
      )}
    </React.Fragment>
  );
};


export default  TeachApp;