import Tool from "./Tool";

export default class InsertElementTool extends Tool {
    constructor(elementType) {
        super(`insert-${elementType?.toLowerCase()}`);

        this.elementType = elementType;
    }

    // Bind to a section creating a state to support that section only.
    bindSection(section, target, sectionGrid, onChange) {
        if (!target) {
            return null;
        }

        let tool = new InsertElementTool(this.elementType);

        tool._section = section;
        tool._target = target;
        tool._sectionGrid = sectionGrid;
        tool._onChange = onChange;

        return tool;
    }

    onPointerDown(event) {
        debugger;
    }
    
    onPointerMove(event) { }
    
    onPointerUp(event) { }
}
