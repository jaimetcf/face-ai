import React, { useRef, useContext, useState, useReducer, useCallback } from 'react';

import { NavLink }            from 'react-router-dom';
import { AppContext }         from '../../AppContext';
import User                   from '../user/User';
import Input                  from '../common/Input';
import InputImage             from '../common/InputImage';
import { validateMinLength }  from '../common/InputValidation';
import Button                 from '../common/Button';
import WaitingSpinner         from '../common/WaitingSpinner';
import ErrorModal             from '../common/ErrorModal';

import './Person.css';


// The current user id will be used for inserting the
// new added person into the database
const currentUser = new User();  

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

const AddPerson = (props) => {

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
            name: {             // Name of the new person being added
                value: '',
                isValid: false
            },
            image: {            // A UTF-16 String with the path to the selected image file
                value: null,
                isValid: false
            }
        },
        formValid: false
    });

    // Enables navigation back to /teachapp, after Add person is successful
    const backToTeachApp = useRef();


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

    // Function called when the user clicks the form Add Person button. 
    // It sends the person inputed information to the backend, in a first POST
    // request to the /person/create endpoint. Then, the image uploaded is sent
    // to the backend in a second POST request to the /photo/create endpoint
    const postAddPerson = async (event) => {
        
        event.preventDefault();  // Prevents browser from reloading the page
        setWaiting(true);        // Shows waiting spinner on screen

        // Sends first POST request to /person/create endpoint
        fetch( appContext.backendDomain + '/person/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                    userId:     currentUser.getId(),
                    personName: formState.inputs.name.value
                  }),

        }).then( async (res) => {   // Received a response 2xx, 4xx, or 5xx

            var response = await res.json(); // Converts string to json object
    
            if(res.ok) {   // First POST was successful, status = 2xx
              
                const personId = response.id;    // Extracts personId from the response
                console.log('Added person:');
                console.log('personId => ' + personId );
                console.log('image    => ' + formState.inputs.image.value );

                // Prepares data to be sent using formData object
                const formData = new FormData();
                formData.append('personId',  personId                     );
                formData.append('image',     formState.inputs.image.value );

                // Sends the second POST request, this time to the /photo/create endpoint
                fetch( appContext.backendDomain + '/photo/create', { method: 'POST', body: formData } )
                .then( async (res) => {     // Received a response 2xx, 4xx, or 5xx
    
                    response = await res.json(); // Converts string to json object

                    if(res.ok) {   // Status = 2xx
                        setWaiting(false);      // Hides waiting spinner          
                        console.log('Created photo: ' + response );

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
                    setError(err.message);  // Shows error modal with error msg on screen  
                });
            }
            else {    // Response status from first POST IS NOT 2xx

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
            <form className='person-form' onSubmit={postAddPerson}>
                <Input
                    id='name' 
                    element='input' 
                    type='text' 
                    label='Name'
                    align='center'
                    validationList={[ validateMinLength(1) ]}
                    errorMsg='Name field is empty. Please, type a name.'
                    getState={getInputState}
                />
                <InputImage
                    id='image' 
                    element='input' 
                    type='file' 
                    label='Photo'
                    center='true'
                    validationList={[ validateMinLength(5) ]}
                    errorMsg='File name is invalid. Please, type a valid file name.'
                    getState={getInputState}
                />
                <Button type='submit' disabled={!formState.formValid}>
                    Add Person
                </Button>
                <Button to='/teachapp'>Back</Button>
                <NavLink     // This link is invisible and used to navigate back to /teachapp screen
                    to='/teachapp'
                    ref={backToTeachApp}>
                </NavLink>
            </form>
            )}
        </React.Fragment>
    );
}


export default  AddPerson;