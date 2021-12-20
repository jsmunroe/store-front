import * as actionTypes from './actionTypes';

export function createView(view) {
    return { type: actionTypes.createView, view }
}

export function saveView(view) {
    return { type: actionTypes.saveView, view }
}