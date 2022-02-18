import { forwardRef } from "react";
import { breaksToNewLines, newLinesToBreaks, sanitize, unsanitize } from "../../utils/htmlHelpers";
import { px } from "../../utils/number";
import TextOptionsForm from "../options/TextOptionsForm";
import ElementBase from "./ElementBase";

function translateFlexAlign(align) {
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

    const format = text => {
        text = sanitize(text);
        text = newLinesToBreaks(text);
        return text;
    }

    const parse = text => {
        text = breaksToNewLines(text);
        text = unsanitize(text);
    }

    let style = { 
        display: 'flex',
        justifyContent: translateFlexAlign(element.horizontalAlign),
        alignItems: translateFlexAlign(element.verticalAlign),
        textAlign: element.horizontalAlign,
        fontWeight: element.isBold ? "600" : "normal",
        fontStyle: element.isItalic ? "italic" : "normal",
        fontSize: px(element.fontSize) ?? '16px'
    };    

    const handleInput = event => {
        props.onChange({...element, text: parse(event.target.innerText)});
    }

    return <ElementBase element={element} optionsForm={TextOptionsForm} {...props}>
       <div className="element__text" contentEditable style={style} dangerouslySetInnerHTML={{__html: format(element.text)}} onInput={handleInput}></div>
    </ElementBase>
});

export default Text;