import React, { useContext, useReducer, useCallback } from 'react';

import { AppContext }  from '../../AppContext';
import User            from './User';
import Input           from '../common/Input';
import { validateMinLength, validateEmail } from '../common/InputValidation';
import Button          from '../common/Button';
import WaitingSpinner  from '../common/WaitingSpinner';
import ErrorModal      from '../common/ErrorModal';
import { useHttp }     from '../common/UseHttp';
import './User.css';


const currentUser = new User();


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

const Signup = (props) => {

    const appContext = useContext(AppContext);

    const { waiting, error, httpRequest, clearError } = useHttp();

    // This state saves the form data (user inputs)
    const [ formState, dispatch ] = useReducer( formReducer, {
        inputs: {
            name: {
                value: '',
                isValid: false
            },
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

    const getInputState = useCallback( (id, value, isValid) => {
        dispatch({ 
            type: 'CHANGE', 
            inputId: id, 
            value: value, 
            isValid: isValid
        });
    }, [] );

    const postSignup = async (event) => {
        
        event.preventDefault();  // Prevents browser from reloading the page

        // Sends request to backend
        httpRequest( 
            appContext.backendDomain + '/user/signup',
            'POST',
            { 'Content-Type': 'application/json' },
            JSON.stringify({
                name:     formState.inputs.name.value,
                email:    formState.inputs.email.value,
                password: formState.inputs.password.value
            })
 
        ).then( (response) => {  
            // Only treats status 2xx here. Status 4xx and 5xx are treated in UseHttp.js           
            console.log(response);
              
            // Sets current user information
            currentUser.setState(true);
            currentUser.setId(response.userId);       // Saves userId in currentUser
            currentUser.setName(response.userName);   // Saves userId in currentUser
            appContext.loginFun();                 // Confirms user login in appContext
        });
    }

    return( 
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {waiting && <WaitingSpinner asOverlay/>}
            {!waiting && (
            <form className='signup-form' onSubmit={postSignup}>
                <Input
                    id='name' 
                    element='input' 
                    type='text' 
                    label='Name'
                    validationList={[ validateMinLength(1) ]}
                    errorMsg='Name is empty. Please, type a name.'
                    getState={getInputState}
                />
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
                    Sign up
                </Button>
            </form>
            )}
        </React.Fragment>
    );
}


export default  Signup;