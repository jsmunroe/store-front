import uuid from 'react-uuid';
import { createSection } from './createSection';

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