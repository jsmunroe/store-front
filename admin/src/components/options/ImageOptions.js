import { toNameValue } from "../../utils/htmlHelpers";

export default function ImageOptions({element, onChange}) {
    const handlePropertyValueChange = (name, value) => {
        onChange({...element, [name]: value})
    }

    return <>
        <div className="form__title"><i className="icon-image"></i> Text Element Properties</div>

        <label className="form__label">Image Source</label>
        <input className="form__input" name="src" type="text" value={element.src} onChange={toNameValue(handlePropertyValueChange)} required></input>
    </>;
}
