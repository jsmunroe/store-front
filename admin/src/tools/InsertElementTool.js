import Tool from "./Tool"
import { createElement } from "../models/createElement"
import { saveElementOnProperty } from "../utils/mutate"

export default class InsertElementTool extends Tool {
    constructor(elementType) {
        super();
        
        this.key = `insert-${elementType}`.toLowerCase();
        this.elementType = elementType;
    }
    
    buildState(view, target, viewGrid, onChange) {
        const toolState = super.buildState(target, viewGrid, onChange);

        if (toolState.targetType !== 'view') {
            return null;
        }

        return {
            ...toolState,
            elementType: this.elementType,

            view: view,
            target: target,
            viewGrid: viewGrid,
            onChange: onChange,
    
            pointerDownCell: null,
    
            selectionEnabled: true,
        }
    }

    onSelect(toolState, selection) {
        const element = createElement(this.elementType, selection);
        const view = saveElementOnProperty(toolState.view, 'elements', element);

        toolState.onChange(view);
    }
}
