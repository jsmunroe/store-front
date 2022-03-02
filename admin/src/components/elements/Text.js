import { px } from "../../utils/number";
import TextOptionsForm from "../options/TextOptionsForm";
import ElementBase from "./ElementBase";

export function translateFlexAlign(align) {
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

export default function Text({element, ...props}) {
    let style = { 
        display: 'flex',
        justifyContent: translateFlexAlign(element.horizontalAlign),
        alignItems: translateFlexAlign(element.verticalAlign),
        textAlign: element.horizontalAlign,
        fontWeight: element.isBold ? "600" : "normal",
        fontStyle: element.isItalic ? "italic" : "normal",
        fontSize: px(element.fontSize) ?? '16px'
    };    

    return <ElementBase element={element} optionsForm={TextOptionsForm} {...props}>
        <div className="element__text" tabIndex={-1} style={style} dangerouslySetInnerHTML={{ __html: element.text }}></div>
    </ElementBase>
}
