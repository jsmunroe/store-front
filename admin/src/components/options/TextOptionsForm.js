import { toNameValue } from "../../utils/htmlHelpers";
import ReactQuill from 'react-quill';
import RadioButton from "../controls/RadioButton";
import ElementOptionsForm from "./ElementOptionsForm";
import 'react-quill/dist/quill.snow.css';

const { Quill } = ReactQuill;
var icons = Quill.import('ui/icons');
icons.bold = '<i class="fas fa-bold fa-fw"></i>';
Quill.register('ui/icons', icons);

function TextOptionsForm({elementOptions, onChange}) {
    const handlePropertyValueChange = (name, value) => {
        onChange({...elementOptions, [name]: value})
    }

    const handleKeyDown = event => {
        event.stopPropagation();
    }

    const fontSizes = [10, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 84];

    const modules = {
        toolbar: {
            container: '#toolbar',
        },
    };

    return <>
        <div className="form__title"><i className="icon-text"></i> Text Element Properties</div>
        
        <div className="form__row">
            <EditorToolbar />
            <ReactQuill theme="snow" value={elementOptions.text} modules={modules} onChange={value => handlePropertyValueChange('text', value)} onKeyDown={handleKeyDown} />
            <br/>
        </div>

        <label className="form__label">Font Size</label>
        <div>
            <select className="form__select" name="fontSize" value={elementOptions.fontSize} onChange={toNameValue(handlePropertyValueChange)}>
                {fontSizes.map(f => <option key={f} value={f}>{f} pixels</option>)}
            </select>
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

function EditorToolbar() {
    return <div id="toolbar">
        <button className="ql-bold form__checkbox"><i className="fas fa-bold fa-fw"></i></button>
        <button className="ql-italic form__checkbox"></button>
        <button className="ql-underline form__checkbox"></button>
        <button className="ql-strike form__checkbox"></button>
        <button className="ql-link form__checkbox"></button>
        <button className="ql-clean form__checkbox"></button>
    </div>
}

export default ElementOptionsForm(TextOptionsForm);