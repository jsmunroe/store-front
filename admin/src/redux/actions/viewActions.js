import * as actionTypes from './actionTypes';
import * as api from '../../api/views.api';
import { saveElement } from '../../utils/mutate';

export function loadViews(views) {
    return { type: actionTypes.loadViews, views }
}

export function loadView(view) {
    return { type: actionTypes.loadView, view }
}

export function loadViewById(viewId) {
    return async (dispatch, getState) => {
        const { views } = getState();

        const view = views.find(view => view.id === viewId);

        dispatch(loadView(view));
    }
}

export function saveView(view) {
    return async (dispatch, getState) => {
        await api.saveView(view);
        
        dispatch( { type: actionTypes.saveView, view } );
    }
}

export function saveSection(view, section) {
    return async (dispatch, getState) => {
        view = {...view, sections: saveElement(view.sections, section) };

        await api.saveView(view);

        dispatch( { type: actionTypes.saveView, view } );
    }
}
