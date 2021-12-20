import * as actionTypes from './actionTypes';

export function loadView(view) {
    return { type: actionTypes.loadView, view }
}

export function saveView(view) {
    return { type: actionTypes.saveView, view }
}