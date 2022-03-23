import { useState } from "react";
import { createView } from "../models/createView";
import { replace, toNameValue } from "../utils/htmlHelpers";

export default function ViewOptionsForm({view: viewProp, onSubmit, onCancel}) {
    const [view, setView] = useState(viewProp ?? {});

    const handleFormSubmit = event => {
        if (!onSubmit) {
            console.warn('Form has not been given an onSubmit handler.')
            return;
        }

        if (!view.id) {
            onSubmit(createView(view.name));
        }
        
        onSubmit(view);
    }

    const handleViewChange = (name, value) => {
        setView(view => ({...view, [name]: value}))
    }

    const handleCancelClick = event => {      
        onCancel && onCancel();
    }

    return <form className="form" onSubmit={replace(handleFormSubmit)}>
        <label className="form__label">Name</label>
        <input className="form__input" type="text" name="name" value={view.name} onChange={toNameValue(handleViewChange)} autoFocus required></input>
        <div className="form__buttons">
            <button type="submit" className="form__submit">{view.id ? "Save" : "Create"}</button>
            <button type="button" className="form__button" onClick={handleCancelClick}>Cancel</button>
        </div>
    </form>
}