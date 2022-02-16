import { useState } from "react"

const ElementOptionsForm = Component => {
    const ElementOptionsComponent = ({elementOptions, onSubmit, onCancel, ...props}) => {
        const [options, setOptions] = useState(elementOptions);

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
                
                {/* Common options for all elements would go here. */}

                <Component elementOptions={options} onChange={handleElementOptionsChange} />
                
                <div className="form__buttons">
                    <button type="submit" className="form__submit">Save</button>
                    <button type="button" className="form__button" onClick={handleCancelClick}>Cancel</button>
                </div>
            </form>
    }

    return ElementOptionsComponent;
}

export default ElementOptionsForm;