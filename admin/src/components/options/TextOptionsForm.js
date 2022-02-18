import { toNameValue } from "../../utils/htmlHelpers";
import RadioButton from "../controls/RadioButton";
import ElementOptionsForm from "./ElementOptionsForm";

function TextOptionsForm({elementOptions, onChange}) {
    const handlePropertyValueChange = (name, value) => {
        onChange({...elementOptions, [name]: value})
    }

    return <>
        <label className="form__label">Text</label>
        <textarea className="form__textarea"  name="text" type="text" autoFocus rows={3} value={elementOptions.text} onChange={toNameValue(handlePropertyValueChange)} required></textarea>

        <label className="form__label">Horizontal Align</label>
        <div>
            <RadioButton className="form__radio" name="horizontalAlign" value="left" checked={elementOptions.horizontalAlign === 'left'} onChange={toNameValue(handlePropertyValueChange)}><i className="fas fa-align-left fa-fw"></i></RadioButton>
            <RadioButton className="form__radio" name="horizontalAlign" value="center" checked={elementOptions.horizontalAlign === 'center'} onChange={toNameValue(handlePropertyValueChange)}><i className="fas fa-align-center fa-fw"></i></RadioButton>
            <RadioButton className="form__radio" name="horizontalAlign" value="right" checked={elementOptions.horizontalAlign === 'right'} onChange={toNameValue(handlePropertyValueChange)}><i className="fas fa-align-right fa-fw"></i></RadioButton>
        </div>

        <label className="form__label">Vertical Align</label>
        <div>
            <RadioButton className="form__radio" name="verticalAlign" value="top" checked={elementOptions.verticalAlign === 'top'} onChange={toNameValue(handlePropertyValueChange)}><i className="fas fa-grip-lines fa-fw super"></i></RadioButton>
            <RadioButton className="form__radio" name="verticalAlign" value="middle" checked={elementOptions.verticalAlign === 'middle'} onChange={toNameValue(handlePropertyValueChange)}><i className="fas fa-grip-lines fa-fw"></i></RadioButton>
            <RadioButton className="form__radio" name="verticalAlign" value="bottom" checked={elementOptions.verticalAlign === 'bottom'} onChange={toNameValue(handlePropertyValueChange)}><i className="fas fa-grip-lines fa-fw sub"></i></RadioButton>
        </div>
    </>;
}

export default ElementOptionsForm(TextOptionsForm);