import { forwardRef } from "react";
import { sanitize } from "../../utils/htmlHelpers";
import TextOptionsForm from "../options/TextOptionsForm";
import ElementBase from "./ElementBase";

function translateAlign(align) {
    switch (align) {
        case 'left':
        case 'top':
            return 'start';
        case 'right':
        case 'bottom':
            return 'end';
        case 'middle':
            return 'center';
        default:
            return align;
    }
}

const Text = forwardRef(({element, ...props}, ref) => {

    let style = { 
        display: 'flex',
        justifyContent: translateAlign(element.horizontalAlign),
        alignItems: translateAlign(element.verticalAlign),
    };    

    const handleInput = event => {
        props.onChange({...element, text: event.target.innerText});
    }

    return <ElementBase element={element} optionsForm={TextOptionsForm} {...props}>
       <div className="element__text" contentEditable style={style} dangerouslySetInnerHTML={{__html: sanitize(element.text)}} onInput={handleInput}></div>
    </ElementBase>
});

export default Text;