import uuid from 'react-uuid';

export function createView(name) {
    if (typeof name !== "string") {
        throw new Error(`Argument name (${name}) is not correct.`)
    }
    
    return {
        id: uuid(),
        name,
        sections: [createSection()],
    };
}

export function createSection() {
    return {
        id: uuid(),
        columns: 12,
        rows: 12
    }
}