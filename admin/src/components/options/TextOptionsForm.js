import { toNameValue } from "../../utils/htmlHelpers";
import ReactQuill from 'react-quill';
import RadioButton from "../controls/RadioButton";
import ElementOptionsForm from "./ElementOptionsForm";
import 'react-quill/dist/quill.snow.css';

const { Quill } = ReactQuill;

var icons = Quill.import('ui/icons');
icons.bold = '<i class="fas fa-bold fa-fw"></i>';
icons.italic = '<i class="fas fa-italic fa-fw"></i>';
icons.underline = '<i class="fas fa-underline fa-fw"></i>';
icons.strike = '<i class="fas fa-strikethrough fa-fw"></i>';
icons.link = '<i class="fas fa-link fa-fw"></i>';
icons.clean = '<i class="fas fa-remove-format fa-fw"></i>';

Quill.register('ui/icons', icons, true);

function TextOptionsForm({elementOptions, onChange}) {
    const handlePropertyValueChange = (name, value) => {
        onChange({...elementOptions, [name]: value})
    }

    const handleKeyDown = event => {
        event.stopPropagation();
    }

    const fontSizes = [
        { text: 'Very Small', size: 10 },
        { text: 'Small', size: 14 },
        { text: 'Normal', size: 16 },
        { text: 'Large', size: 24 },
        { text: 'Header', size: 36 },
        { text: 'Banner', size: 48 },
    ];

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
                {fontSizes.map(f => <option key={f.size} value={f.size}>{f.text}</option>)}
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
        <button className="ql-bold" title="Bold"></button>
        <button className="ql-italic" title="Italics"></button>
        <button className="ql-underline" title="Underline"></button>
        <button className="ql-strike" title="Strike-through"></button>
        <button className="ql-link" title="Create Link"></button>
        <button className="ql-clean" title="Clear Format"></button>
    </div>
}

export default ElementOptionsForm(TextOptionsForm);