import React, { useRef, useContext, useState, useReducer, useCallback } from 'react';
import { useParams }          from 'react-router-dom';

import { NavLink }            from 'react-router-dom';
import { AppContext }         from '../../AppContext';
import InputImage             from '../common/InputImage';
import { validateMinLength }  from '../common/InputValidation';
import Panel                  from '../common/Panel';
import Button                 from '../common/Button';
import WaitingSpinner         from '../common/WaitingSpinner';
import ErrorModal             from '../common/ErrorModal';

import '../person/Person.css';


// Executes form validation
const formReducer = (state, action) => {
    switch(action.type) {
        
        case 'CHANGE':
            let formIsValid = true;
            for( const inputId in state.inputs) {
                if(inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid
                }
                else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {
                        value: action.value,
                        isValid: action.isValid
                    }
                },
                formValid: formIsValid
            };
        default:
            return state;
    }
};

const AddPhoto = (props) => {

    // Gets the database person id and name from the caller component (UpdatePerson)
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
    const [ error, setError ] = useState(null);

    // This state saves the form data (user inputs)
    const [ formState, dispatch ] = useReducer( formReducer, {
        inputs: {
            image: {            // A UTF-16 String with the path to the selected image file
                value: null,
                isValid: false
            }
        },
        formValid: false
    });

    // Enables navigation back to '/person/update/:id/:name', after Add photo is successful
    const backToUpdatePerson = useRef();


    // ---------------------------- FUNCTIONS -------------------------------
    // This function is called by each Input component in the Signin form, as each
    // respective Input value changes, so that this value can be passed back to
    // this Signin component. 
    const getInputState = useCallback( (id, value, isValid) => {
        // Receives the parameters from each Input, as calls formReducer,
        // define above, with these parameters
        dispatch({ 
            type: 'CHANGE', 
            inputId: id, 
            value: value, 
            isValid: isValid
        });
    }, [] );

    // Function called when the user clicks the form Add Photo button. 
    // It sends the personId and the image uploaded to the backend in 
    // a POST request to the /photo/create endpoint
    const postAddPhoto = async (event) => {
        
        event.preventDefault();  // Prevents browser from reloading the page
        setWaiting(true);        // Shows waiting spinner on screen

        // Prepares data to be sent using formData object
        const formData = new FormData();
        formData.append('personId',  personId                     );
        formData.append('image',     formState.inputs.image.value );

        // Sends the POST request to the /photo/create endpoint
        fetch( appContext.backendDomain + '/photo/create', { method: 'POST', body: formData } )
        .then( async (res) => {     // Received a response 2xx, 4xx, or 5xx
    
            const response = await res.json(); // Converts string to json object

            if(res.ok) {   // Status = 2xx
                setWaiting(false);      // Hides waiting spinner          
                console.log('Added photo: ' + response );

                // Sends a click event to this link to navigate back to /person/update/:id/:name
                backToUpdatePerson.current.click(); 
            }
            else {         // Status IS NOT 2xx
         
                // Forwards error message comming from backend
                // to be treated in the catch block, below
                throw new Error(response.message);
            }

        }).catch( (err) => {  // Communication error or response status is not 2xx
            setWaiting(false);      // Hides waiting spinner
            setError(err.message);  // Shows error modal with error msg on screen  
        });
    }

    // Updates component error state
    const clearError = () => {
        setError(null);
    };
    

    // ---------------------------- RENDERING -------------------------------
    return( 
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {waiting && <WaitingSpinner asOverlay/>}
            {!waiting && (
            <form className='person-form' onSubmit={postAddPhoto}>
                <div style={{textAlign: 'center'}}>
                    <h2>{personName}</h2>
                </div>
                <InputImage
                    id='image' 
                    element='input' 
                    type='file' 
                    label='Photo'
                    center='true'
                    validationList={[ validateMinLength(5) ]}
                    errorMsg='File name is invalid. Please, select a valid file name.'
                    getState={getInputState}
                />
                <Button type='submit' disabled={!formState.formValid}>
                    Add Photo
                </Button>
                <Button to={`/person/update/${personId}/${personName}`}>Back</Button>
                <NavLink     // This link is invisible and just used to navigate back to /person/update screen
                    to={`/person/update/${personId}/${personName}`}
                    ref={backToUpdatePerson}>
                </NavLink>
            </form>
            )}
        </React.Fragment>
    );
}


export default  AddPhoto;