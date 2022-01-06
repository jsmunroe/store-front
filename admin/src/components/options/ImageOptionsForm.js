import { toNameValue } from "../../utils/htmlHelpers";
import ElementOptionsForm from "./ElementOptionsForm";

function ImageOptionsForm({elementOptions, onChange}) {
    const handlePropertyValueChange = (name, value) => {
        onChange({...elementOptions, [name]: value})
    }

    return <>
        <label className="form__label">Image Source</label>
        <input className="form__input" name="src" type="text" value={elementOptions.src} onChange={toNameValue(handlePropertyValueChange)} required></input>
    </>;
}

export default ElementOptionsForm(ImageOptionsForm);