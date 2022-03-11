export function createViewEditor(view) {
    if (typeof view !== "object" || !view.id) {
        throw new Error(`Argument view is not a view.`)
    }
    
    return {
        view,
        selectedElements: []
    };
}