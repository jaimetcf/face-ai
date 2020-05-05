import React, { useContext, useState, useReducer, useCallback } from 'react';

import { AppContext }  from '../../AppContext';
import User            from './User';
import Input           from '../common/Input';
import { validateMinLength, validateEmail } from '../common/InputValidation';
import Button          from '../common/Button';
import WaitingSpinner  from '../common/WaitingSpinner';
import ErrorModal      from '../common/ErrorModal';

import './User.css';


const currentUser = new User();  // Needed for updating current user info


// Executes the Signin form validation
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

const Signin = (props) => {

    // Needed for recovering domain name and for changing app context
    // from user logout into user logged in
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
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        formValid: false
    });


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

    // Function called when the user clicks the form Login button
    // It sends the user inputed information to the backend
    const postSignin = async (event) => {
        
        event.preventDefault();  // Prevents browser from reloading the page
        setWaiting(true);        // Shows waiting spinner on screen

        // Sends POST request to the backend
        fetch( appContext.backendDomain + '/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                    email:    formState.inputs.email.value,
                    password: formState.inputs.password.value
                  }),
        }).then( async (res) => {   // Received a response 2xx, 4xx, or 5xx

            const response = await res.json(); // Converts string to json object
    
            if(res.ok) {   // Status = 2xx
              
              setWaiting(false);      // Hides waiting spinner

              // Sets current user information
              currentUser.setState(true);
              currentUser.setId(response.userId);       // Saves userId in currentUser
              currentUser.setName(response.userName);   // Saves userId in currentUser
              console.log('userId:  ' + currentUser.getId() );
              console.log('userName:' + currentUser.getName() );

              appContext.loginFun();                    // Confirms user login in appContext
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
    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {waiting && <WaitingSpinner asOverlay/>}
            {!waiting && (
            <form className='signin-form' onSubmit={postSignin}>
                <Input
                    id='email' 
                    element='input' 
                    type='text' 
                    label='E-mail'
                    validationList={[ validateEmail() ]}
                    errorMsg='The e-mail address is invalid. Please, type a valid e-mail address.'
                    getState={getInputState}
                />
                <Input
                    id='password' 
                    element='input' 
                    type='text' 
                    label='Password'
                    validationList={[ validateMinLength(6) ]}
                    errorMsg='The password has less than 6 characteres. Please, type a password with 6 characteres or more.'
                    getState={getInputState}
                />
                <Button type='submit' disabled={!formState.formValid}>
                    Login
                </Button>
            </form>
            )}
        </React.Fragment>
    );
}


export default  Signin;