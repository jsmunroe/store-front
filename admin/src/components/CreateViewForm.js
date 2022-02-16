import { useState } from "react";
import { createView } from "../models/createView";
import { replace, toValue } from "../utils/htmlHelpers";

export default function CreateViewForm({onSubmit, onCancel}) {
    const [name, setName] = useState('');

    const clearForm = () => {
        setName('');
    }

    const handleFormSubmit = event => {
        const view = createView(name)
        
        !!onSubmit && onSubmit(view);
        clearForm();
    }

    const handleCancelClick = event => {      
        !!onCancel && onCancel();
        clearForm();
    }

    return <form className="form" onSubmit={replace(handleFormSubmit)}>
        <label className="form__label">Name</label>
        <input className="form__input" type="text" value={name} onChange={toValue(setName)} autoFocus required></input>
        <div className="form__buttons">
            <button type="submit" className="form__submit">Create</button>
            <button type="button" className="form__button" onClick={handleCancelClick}>Cancel</button>
        </div>
    </form>
}