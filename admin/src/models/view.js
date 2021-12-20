import uuid from 'react-uuid';

export function createView(name) {
    if (typeof name !== "string") {
        throw new Error(`Argument name (${name}) is not correct.`)
    }
    
    return {
        id: uuid(),
        name,
    };
}