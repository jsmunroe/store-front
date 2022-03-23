import ReactQuill from "react-quill";
import useFieldState from "../../hooks/useFormState";
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

export default function TextEditor({name}) {
    const [value, setValue] = useFieldState(name);

    const handleKeyDown = event => {
        event.stopPropagation();
    }

    const handleChange = value => {
        setValue(value);
    }

    const modules = {
        toolbar: {
            container: '#toolbar',
        },
    };

    return <>
        <EditorToolbar />
        <ReactQuill theme="snow" value={value} modules={modules} onChange={handleChange} onKeyDown={handleKeyDown} />
        <br/>
    </>
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