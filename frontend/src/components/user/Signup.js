import React, { useContext, useReducer, useCallback } from 'react';

import { AppContext }                       from '../../AppContext';
import Input                                from '../common/Input';
import { validateMinLength, validateEmail } from '../common/InputValidation';
import Button                               from '../common/Button'
import './User.css';


const formReducer = (state, action) => {
    switch(action.type) {
        
        case 'CHANGE':
            let formIsValid = true;
            for( const inputId in state.inputs) {
                if(inputId == action.inputId) {
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

    const [ formState, dispatch ] = useReducer( formReducer, {
        inputs: {
            name_input: {
                value: '',
                isValid: false
            },
            email_input: {
                value: '',
                isValid: false
            },
            pw_input: {
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

    const appContext = useContext(AppContext);
    const postSignup = (event) => {
        event.preventDefault();  // Prevents browser from reloading the page

        // Send request to backend

        appContext.loginFun();
    }

    return( 
        <form className='signup-form' onSubmit={postSignup}>
            <Input
                id='name_input' 
                element='input' 
                type='text' 
                label='Name'
                validationList={[ validateMinLength(1) ]}
                errorMsg='Name is empty. Please, type a name.'
                getState={getInputState}
            />
            <Input
                id='email_input' 
                element='input' 
                type='text' 
                label='E-mail'
                validationList={[ validateEmail() ]}
                errorMsg='The e-mail address is invalid. Please, type a valid e-mail address.'
                getState={getInputState}
            />
            <Input
                id='pw_input' 
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
    );
}


export default  Signup;