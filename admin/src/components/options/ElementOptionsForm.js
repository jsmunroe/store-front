import Form from "../controls/Form";
import ElementOptionsFormContent from "./ElementOptionsFormContent";

export default function ElementOptionsForm ({element, onSubmit, onCancel, ...props}) {
    const handleSubmitForm = element => {
        onSubmit(element);
    }

    const handleCancelClick = event => {
        onCancel();
    }

    return <Form className="form" state={element} onSubmit={handleSubmitForm}>
        <ElementOptionsFormContent type={element.type} />
        
        <div className="form__buttons">
            <button type="submit" className="form__submit">Save</button>
            <button type="button" className="form__button" onClick={handleCancelClick}>Cancel</button>
        </div>
    </Form>
}
