import * as actionTypes from './actionTypes';


export function loadViews(views) {
    return { type: actionTypes.loadViews, views }
}

export function loadView(view) {
    return { type: actionTypes.loadView, view }
}

export function loadViewById(viewId) {
    return async (dispatch, getState) => {
        const { views } = getState();

        if (!viewId) {
            return;
        }

        const view = views.all.find(view => view.id === viewId);

        if (!view) {
            return;
        }

        dispatch(loadView(view));
    }
}

export function saveView(view) {
    return { type: actionTypes.saveView, view };
}

export function removeView(view) {
    return { type: actionTypes.removeView, view }
}
