import { toNameIsChecked, toNameValue } from "../../utils/htmlHelpers";
import Checkbox from "../controls/Checkbox";
import RadioButton from "../controls/RadioButton";
import ElementOptionsForm from "./ElementOptionsForm";

function TextOptionsForm({elementOptions, onChange}) {
    const handlePropertyValueChange = (name, value) => {
        onChange({...elementOptions, [name]: value})
    }

    const fontSizes = [10, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 84];

    return <>
        <div className="form__title"><i className="icon-text"></i> Text Element Properties</div>
        
        <label className="form__label">Text</label>
        <textarea className="form__textarea"  name="text" type="text" autoFocus rows={3} value={elementOptions.text} onChange={toNameValue(handlePropertyValueChange)} required></textarea>

        <label className="form__label">Font</label>
        <div>
            <select className="form__select" name="fontSize" value={elementOptions.fontSize} onChange={toNameValue(handlePropertyValueChange)}>
                {fontSizes.map(f => <option key={f} value={f}>{f} pixels</option>)}
            </select>
            &nbsp;&nbsp;
            <Checkbox className="form__checkbox" name="isBold" title="Bold" value={true} checked={elementOptions.isBold} onChange={toNameIsChecked(handlePropertyValueChange)}><i className="fas fa-bold fa-fw"></i></Checkbox>
            <Checkbox className="form__checkbox" name="isItalic" title="Italic" value={true} checked={elementOptions.isItalic} onChange={toNameIsChecked(handlePropertyValueChange)}><i className="fas fa-italic fa-fw"></i></Checkbox>
        </div>

        <label className="form__label">Horizontal Align</label>
        <div>
            <RadioButton className="form__radio" name="horizontalAlign" title="Left" value="left" checked={elementOptions.horizontalAlign === 'left'} onChange={toNameValue(handlePropertyValueChange)}><i className="fas fa-align-left fa-fw"></i></RadioButton>
            <RadioButton className="form__radio" name="horizontalAlign" title="Center" value="center" checked={elementOptions.horizontalAlign === 'center'} onChange={toNameValue(handlePropertyValueChange)}><i className="fas fa-align-center fa-fw"></i></RadioButton>
            <RadioButton className="form__radio" name="horizontalAlign" title="Right" value="right" checked={elementOptions.horizontalAlign === 'right'} onChange={toNameValue(handlePropertyValueChange)}><i className="fas fa-align-right fa-fw"></i></RadioButton>
        </div>

        <label className="form__label">Vertical Align</label>
        <div>
            <RadioButton className="form__radio" name="verticalAlign" title="Top" value="top" checked={elementOptions.verticalAlign === 'top'} onChange={toNameValue(handlePropertyValueChange)}><i className="fas fa-grip-lines fa-fw super"></i></RadioButton>
            <RadioButton className="form__radio" name="verticalAlign" title="Middle" value="middle" checked={elementOptions.verticalAlign === 'middle'} onChange={toNameValue(handlePropertyValueChange)}><i className="fas fa-grip-lines fa-fw"></i></RadioButton>
            <RadioButton className="form__radio" name="verticalAlign" title="Bottom" value="bottom" checked={elementOptions.verticalAlign === 'bottom'} onChange={toNameValue(handlePropertyValueChange)}><i className="fas fa-grip-lines fa-fw sub"></i></RadioButton>
        </div>
    </>;
}

export default ElementOptionsForm(TextOptionsForm);