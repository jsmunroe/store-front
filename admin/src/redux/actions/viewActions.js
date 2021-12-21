import * as actionTypes from './actionTypes';
import * as api from '../../api/views.api';

export function loadViews(views) {
    return { type: actionTypes.loadViews, views }
}

export function loadView(view) {
    return { type: actionTypes.loadView, view }
}

export function saveView(view) {
    return async (dispatch, getState) => {
        await api.saveView(view);
        
        dispatch( { type: actionTypes.saveView, view } );
    }
}