import { useState } from "react";
import { breaksToNewLines, newLinesToBreaks, sanitize, unsanitize, useClass } from "../../utils/htmlHelpers";
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

const format = text => {
    text = sanitize(text);
    text = newLinesToBreaks(text);
    return text;
}

const parse = text => {
    text = breaksToNewLines(text);
    text = unsanitize(text);
    return text;
}

export default function Text({element, ...props}) {
    const [refBroker] = useState(new RefBroker());
    const [isEditing, setIsEditing] = useState(false);

    let style = { 
        display: 'flex',
        justifyContent: translateFlexAlign(element.horizontalAlign),
        alignItems: translateFlexAlign(element.verticalAlign),
        textAlign: element.horizontalAlign,
        fontWeight: element.isBold ? "600" : "normal",
        fontStyle: element.isItalic ? "italic" : "normal",
        fontSize: px(element.fontSize) ?? '16px'
    };    

    const handleEditClick = event => {
        event.preventDefault();
        event.stopPropagation();

        setIsEditing(true);
        refBroker.subscribe(dom => {
            dom.focus()
        });
    }

    const handleBlur = event => {
        setIsEditing(false);
        props.onChange({...element, text: parse(event.target.innerHTML)});
    }

    return <ElementBase element={element} optionsForm={TextOptionsForm} isEditing={isEditing} {...props}>
        <div className={`element__text ${useClass(isEditing, 'editing')}`} tabIndex={-1} contentEditable={isEditing} style={style} dangerouslySetInnerHTML={{__html: format(element.text)}} onBlur={handleBlur} ref={refBroker.set()}></div>
        {!isEditing && <div className="element__edit-button">
            <button className="element__button" onMouseDown={handleEditClick}>Edit Text</button>
        </div>}
    </ElementBase>
}

class RefBroker {
    constructor() {
        this.subscriptions = [];
        this.domInstance = null;
    }

    set() {
        return (domInstance) => {
            if (!domInstance) {
                return;
            }

            this.domInstance = domInstance;
            this.subscriptions.forEach(s => setTimeout(() => s(domInstance), 250));
            this.subscriptions = [];
        }
    }

    subscribe(delegate) {
        if (typeof delegate !== 'function') {
            throw new Error('Subscribed delegate must be a callback function.');
        }

        if (this.domInstance) {
            delegate(this.domInstance);
        } 
        else {
            this.subscriptions.push(delegate);
        }
    }

}