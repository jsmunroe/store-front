import { Tool, ToolFactory } from "./Tool"
import { createElement } from "../models/createElement"
import { saveElementOnProperty } from "../utils/mutate"

export default class InsertElementToolFactory extends ToolFactory {
    constructor(elementType) {
        super(`insert-${elementType?.toLowerCase()}`);

        this.elementType = elementType;
    }

    // Bind a new tool to a view creating a state to support that view only.
    createViewTool(view, target, viewGrid, onChange) { 
        if (!target) {
            return null;
        }

        return new InsertElementTool(this.elementType, view, target, viewGrid, onChange);
    }
}

export class InsertElementTool extends Tool {
    constructor(elementType, view, target, viewGrid, onChange) {
        super(target, viewGrid, onChange);

        this.elementType = elementType;

        this._view = view;
        this._target = target;
        this._viewGrid = viewGrid;
        this._onChange = onChange;

        this._pointerDownCell = null;

        this._selectionEnabled = true;
    }

    onSelect(selection) {
        const element = createElement(this.elementType, selection);
        const view = saveElementOnProperty(this._view, 'elements', element);

        this._onChange(view);

        setTimeout(() => document.querySelector(`[data-id="${element.id}"]`)?.focus(), 250);
    }
}
