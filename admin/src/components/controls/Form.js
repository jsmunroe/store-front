import {useFormReducer, FormStateContext } from "../../hooks/useFormState";

export default function Form({state, onSubmit, children, ...props}) {
    const formState = useFormReducer(state);

    const handleSubmit = event => {
        event.preventDefault();

        if (!formState.validate()) {
            return;
        }

        onSubmit && onSubmit(formState.getForm());
    }

    return <FormStateContext.Provider value={formState}>
        <form onSubmit={handleSubmit} {...props}>
            {children}
        </form>
    </FormStateContext.Provider>
}