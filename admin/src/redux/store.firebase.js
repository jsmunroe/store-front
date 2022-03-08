import store from "./store";
import * as api from '../api/views.api';

let currentState = store;
function handleStateChange() {
    let previousState = currentState;

    currentState = store.getState();

    if (previousState !== currentState) {
        handleViewChange(currentState);
        handleViewsChange(currentState);
    }
}

const selectView = state => state.view;

let currentViewState = selectView(store.getState());
function handleViewChange(state) {
    let previousState = currentViewState;
    currentViewState = selectView(state);

    if (previousState !== currentViewState && previousState.id === currentViewState.id) {
        api.saveView(currentViewState);
    }
}

const selectViews = state => state.views;

let currentViewsState = selectViews(store.getState());
function handleViewsChange(state) {
    let previousState = currentViewsState;
    currentViewsState = selectViews(state);

    if (previousState !== currentViewsState && previousState.loaded) {
        const newViews = currentViewsState.all.filter(v1 => !previousState.all.some(v2 => v1.id === v2.id));
        newViews.forEach(v => {
            api.saveView(v);
        });

        const removedViews = previousState.all.filter(v1 => !currentViewsState.all.some(v2 => v1.id === v2.id));
        removedViews.forEach(v => {
            api.deleteView(v);
        });
    }
}

store.subscribe(handleStateChange);