import { useState } from "react";
import { createView } from "../models/view";
import { replace, toValue } from "../utils/htmlHelpers";
import { useDialogComplete } from "./Dialog";

export default function CreateViewForm({onSubmit, onCancel}) {
    const [name, setName] = useState('');

    const {complete, isDialog} = useDialogComplete();

    const handleFormSubmit = event => {
        const view = createView(name)

        if (isDialog) {
            return complete(view);
        }
        
        !!onSubmit && onSubmit(view);
    }

    const handleCancelClick = event => {
        if (isDialog) {
            return complete();
        }
        
        !!onCancel && onCancel();
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