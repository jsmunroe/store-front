import Tool from "./Tool";

export default class InsertElementTool extends Tool {
    constructor(elementType) {
        super(`insert-${elementType?.toLowerCase()}`);

        this.elementType = elementType;
    }

}