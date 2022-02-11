export default class Tool {
    constructor(key) {
        this.key = key;
    }

    // Bind to a single element creating a state to support that element only.
    bindElement(element, target, sectionGrid, onChange) {
        return null; // Unless overridden in child classes, element binding is not supported.
    }

    // Bind to a section creating a state to support that section only.
    bindSection(section, target, sectionGrid, onChange) {
        return null; // Unless overriden in child classes, element binding is not supported.
    }

    onPointerDown(event) { }
    
    onPointerMove(event) { }
    
    onPointerUp(event) { }

    onBlur(event) { }

    onFocus(event) { }
}
