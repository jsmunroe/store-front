import TextBox from "../controls/TextBox";

export default function ImageOptions() {
    return <>
        <div className="form__title"><i className="icon-image"></i> Text Element Properties</div>

        <label className="form__label">Image Source</label>
        <TextBox name="src" required />
    </>;
}
