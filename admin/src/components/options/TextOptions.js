import { toNameValue } from "../../utils/htmlHelpers";
import RadioButton from "../controls/RadioButton";
import Select from "../controls/Select";
import TextEditor from "./TextEditor";

export default function TextOptions() {
    const fontSizes = [
        { text: 'Very Small', size: 10 },
        { text: 'Small', size: 14 },
        { text: 'Normal', size: 16 },
        { text: 'Large', size: 24 },
        { text: 'Header', size: 36 },
        { text: 'Banner', size: 48 },
    ];

    return <>
        <div className="form__title"><i className="icon-text"></i> Text Element Properties</div>
        
        <div className="form__row">
            <TextEditor name="text" />
        </div>

        <label className="form__label">Font Size</label>
        <div>
            <Select className="form__select" name="fontSize">
                {fontSizes.map(f => <option key={f.size} value={f.size}>{f.text}</option>)}
            </Select>
        </div>

        <label className="form__label">Horizontal Align</label>
        <div>
            <RadioButton className="form__radio" name="horizontalAlign" title="Left" value="left"><i className="fas fa-align-left fa-fw"></i></RadioButton>
            <RadioButton className="form__radio" name="horizontalAlign" title="Center" value="center"><i className="fas fa-align-center fa-fw"></i></RadioButton>
            <RadioButton className="form__radio" name="horizontalAlign" title="Right" value="right"><i className="fas fa-align-right fa-fw"></i></RadioButton>
        </div>

        <label className="form__label">Vertical Align</label>
        <div>
            <RadioButton className="form__radio" name="verticalAlign" title="Top" value="top"><i className="fas fa-grip-lines fa-fw super"></i></RadioButton>
            <RadioButton className="form__radio" name="verticalAlign" title="Middle" value="middle"><i className="fas fa-grip-lines fa-fw"></i></RadioButton>
            <RadioButton className="form__radio" name="verticalAlign" title="Bottom" value="bottom"><i className="fas fa-grip-lines fa-fw sub"></i></RadioButton>
        </div>
    </>;
}
