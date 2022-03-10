import * as actionTypes from './actionTypes';

export function undo() {
    return { type: actionTypes.undo }
}

export function redo() {
    return { type: actionTypes.redo }
}

export function clearHistory() {
    return { type: actionTypes.clearHistory }
}