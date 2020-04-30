import React, { useReducer, useCallback } from 'react';

import Input from '../common/Input';
import { validateMinLength, validateFileName } from '../common/InputValidation';
import Button from '../common/Button'
import './Person.css';


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

const AddPerson = (props) => {

    const [ formState, dispatch ] = useReducer( formReducer, {
        inputs: {
            name_input: {
                value: '',
                isValid: false
            },
            file_input: {
                value: '',
                isValid: false
            }
        },
        formValid: false
    });

    const getNameInputState = useCallback( (id, value, isValid) => {
        dispatch({ 
            type: 'CHANGE', 
            inputId: id, 
            value: value, 
            isValid: isValid
        });
    }, [] );

    const getFileInputState = useCallback( (id, value, isValid) => {
        dispatch({ 
            type: 'CHANGE', 
            inputId: id, 
            value: value, 
            isValid: isValid
        });
    }, [] );

    const postAddPerson = (event) => {
        event.preventDefault();  // Prevents browser from reloading the page

        // Send request to backend
    }

    return( 
        <form className='person-form' onSubmit={postAddPerson}>
            <Input
                id='name_input' 
                element='input' 
                type='text' 
                label='Name'
                validationList={[ validateMinLength(1) ]}
                errorMsg='Name field is empty. Please, type a name.'
                getState={getNameInputState}
            />
            <Input
                id='file_input' 
                element='input' 
                type='file' 
                label='Photo'
                validationList={[ validateMinLength(1),
                                  validateFileName()    ]}
                errorMsg='File name is invalid. Please, type a valid file name.'
                getState={getFileInputState}
            />
            <Button type='submit' disabled={!formState.formValid}>
                Add Person
            </Button>
        </form>
    );
}


export default  AddPerson;