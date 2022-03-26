import { createContext, useContext, useReducer, useState } from "react";
import { createReducer } from "../utils/reduxHelpers";
import useChange from "./useChange";

const initialState = {
    form: {},
    validators: {},
    errors: {},
}

const actionTypes = {
    setFieldValue: 'SET_FIELD_VALUE',
    setFieldValidator: 'SET_FIELD_VALIDATOR',
    clearAllValidation: 'CLEARE_ALL_VALIDATION',
    clearFieldValidation: 'CLEAR_FIELD_VALIDATION',
    markFieldInvalid: 'MARK_FIELD_INVALID',
}

const formReducer = createReducer({
    [actionTypes.setFieldValue]: (state, {name, value}) => {
        let { form } = state;

        if (form[name] === value) {
            return state;
        }

        form = {...form, [name]: value};
        return {...state, form};
    },

    [actionTypes.setFieldValidator]: (state, {name, validator}) => {
        let { validators } = state;

        if (validators[name] === validator) {
            return state;
        }

        validators = {...validators, [name]: validator};
        return {...state, validators};
    },

    [actionTypes.clearAllValidation]: (state) => {
        let { validators } = state;

        if (!Object.keys(validators).length) {
            return state;
        }

        validators = {};
        return {...state, validators};
    },

    [actionTypes.clearFieldValidation]: (state, {name}) => {
        let { errors } = state;

        if (!errors[name]) {
            return state;
        }

        const {[name]: clearedError, ...rest} = errors;
        return {...state, errors: rest};
    },

    [actionTypes.markFieldInvalid]: (state, {name, error}) =>  {
        let { errors } = state;
        
        if (errors[name] === error) {
            return state;
        }

        errors = {...errors, [name]: error};
        return {...state, errors};
    },
});

class formState {
    constructor(state, dispatch) {
        this.state = state;
        this.dispatch = dispatch;
    }

    getForm() {
        return {...this.state.form};
    }

    setFieldValue(name, value) {
        this.dispatch({type: actionTypes.setFieldValue, name, value});
    }

    getFieldValue(name) {
        return this.state.form[name];
    }

    setFieldValidator(name, validator) {
        if (typeof validator != 'function') {
            throw new Error('Given validator is not a function.');
        }

        this.dispatch({type: actionTypes.setFieldValidator, name, validator});
    }

    clearAllValidation() {
        this.dispatch({type: actionTypes.clearAllValidation});
    }

    clearFieldValidation(name) {
        this.dispatch({type: actionTypes.clearFieldValidation, name});
    }

    markFieldInvalid(name, error) {
        this.dispatch({type: actionTypes.markFieldInvalid, name, error});
    }

    getFieldError(name) {
        return this.state.errors[name];
    }

    validateField(name) {
        const value = this.getFieldValue(name);
        const validator = this.validators[name];

        if (!validator) {
            return ''; // No validator, no validation.
        }

        this.clearFieldValidation(name);
        const error = validator(value, this.state.form);

        if (error) {
            this.markFieldInvalid(name, error);
        }

        return error;
    }

    validate() {
        let isValid = true;
        this.clearAllValidation();
        Object.keys(this.state.form)
            .map(name => ({
                name,
                value: this.state.form[name],
                validator: this.state.validators[name],
            }))
            .filter(({validator}) => !!validator)
            .forEach(({name, value, validator}) => {
                const error = validator(value, this.state.form);

                if (error) {
                    isValid = false;
                    this.markFieldInvalid(name, error);
                }
            });

        return isValid;
    }
}

export function useFormState(form) {
    const [state, dispatch] = useReducer(formReducer, {...initialState, form: form ?? {}});

    return new formState(state, dispatch);
}

export const FormStateContext = createContext();

export default function useFieldState(name, validator) {
    const formState = useContext(FormStateContext);

    useChange(() => {
        if (name && validator && formState) {
            formState.setFieldValidator(name, validator);
        }
    }, [name, !validator]);

    // This simple state and validation section is to support controls that are not within a Form component or without a name.
    const [fieldValue, setFieldValue] = useState();
    if (!formState || !name) { 
        const error = validator ? validator(fieldValue) : '';

        return [fieldValue, setFieldValue, error];
    }

    const value = formState.getFieldValue(name);
    const setValue = value => formState.setFieldValue(name, value);
    const error = formState.getFieldError(name);

    return [value, setValue, error];
}