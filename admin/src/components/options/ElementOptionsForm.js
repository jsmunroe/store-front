import { useState } from "react"
import ElementOptionsFormContent from "./ElementOptionsFormContent";

export default function ElementOptionsForm ({element, onSubmit, onCancel, ...props}) {
    const [options, setOptions] = useState(element);

    const handleElementOptionsChange = (options) => {
        setOptions(p => ({...p, ...options}));
    }

    const handleSubmitForm = event => {
        event.preventDefault();

        onSubmit(options);
    }

    const handleCancelClick = event => {
        onCancel();
    }

    return <form className="form" onSubmit={handleSubmitForm}>
        <ElementOptionsFormContent type={element.type} element={options} onChange={handleElementOptionsChange} />
        
        <div className="form__buttons">
            <button type="submit" className="form__submit">Save</button>
            <button type="button" className="form__button" onClick={handleCancelClick}>Cancel</button>
        </div>
    </form>
}
