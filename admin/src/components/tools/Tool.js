export default class Tool {
    constructor(key) {
        this.key = key;
    }

    // Bind to a single element creating a state to support that element only.
    bindElement(element, target, sectionGrid, onChange) {
        return null; // Unless overridden in child classes, element binding is not supported.
    }
}
