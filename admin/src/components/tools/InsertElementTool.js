import { Tool, ToolFactory } from "./Tool"
import { createElement } from "../../models/createElement"
import { saveElementOnProperty } from "../../utils/mutate"

export default class InsertElementToolFactory extends ToolFactory {
    constructor(elementType) {
        super(`insert-${elementType?.toLowerCase()}`);

        this.elementType = elementType;
    }

    // Bind a new tool to a section creating a state to support that section only.
    createSectionTool(section, target, sectionGrid, onChange) { 
        if (!target) {
            return null;
        }

        return new InsertElementTool(this.elementType, section, target, sectionGrid, onChange);
    }
}

export class InsertElementTool extends Tool {
    constructor(elementType, section, target, sectionGrid, onChange) {
        super(target, sectionGrid, onChange);

        this.elementType = elementType;

        this._section = section;
        this._target = target;
        this._sectionGrid = sectionGrid;
        this._onChange = onChange;

        this._pointerDownCell = null;

        this._selectionEnabled = true;
    }

    onSelect(selection) {
        const element = createElement(this.elementType, selection);
        const section = saveElementOnProperty(this._section, 'elements', element);

        this._onChange(section);
    }
}
