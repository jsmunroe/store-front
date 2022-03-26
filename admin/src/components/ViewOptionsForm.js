import { createView } from "../models/createView";
import Form from "./controls/Form";
import TextBox from "./controls/TextBox";

export default function ViewOptionsForm({view, onSubmit, onCancel}) {
    const handleFormSubmit = data => {
        if (!onSubmit) {
            console.warn('Form has not been given an onSubmit handler.')
            return;
        }

        if (!data.id) {
            onSubmit(createView(data.name));
        }
        
        onSubmit(data);
    }

    const handleCancelClick = event => {      
        onCancel && onCancel();
    }

    return <Form className="form" state={view} onSubmit={handleFormSubmit}>
        <div className="form__title"><i className="icon-view"></i> View Properties</div>

        <label className="form__label">Name</label>
        <TextBox className="form__input" name="name" autoFocus />
        <div className="form__buttons">
            <button type="submit" className="form__submit">{view?.id ? "Save" : "Create"}</button>
            <button type="button" className="form__button" onClick={handleCancelClick}>Cancel</button>
        </div>
    </Form>
}