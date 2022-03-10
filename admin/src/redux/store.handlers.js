import store, { getState, dispatch } from "./store";
import * as api from '../api/views.api';
import { saveView } from "./actions/viewActions";

// See: https://redux.js.org/api/store#subscribelistener

const handlers = [];

let currentState = store;
function handleStateChange() {
    let previousState = currentState;

    currentState = store.getState();

    if (previousState !== currentState) {
        handlers.forEach(h => h(currentState));
    }
}

export function registerHandler(handler, select = state => state) {
    let currentState;
    handlers.push(state => {
        let previousState = currentState;
        currentState = select(state);
        
        if (previousState && previousState !== currentState) {
            handler({currentState, previousState, getState, dispatch});
        }
    });
}

// Save view in editor when it changes.
registerHandler(({currentState, previousState, getState, dispatch}) => {

    // Save view to the api.
    if (previousState.id === currentState.id) {
        api.saveView(currentState);
    }

    // Save view to the views list.
    if (previousState.id === currentState.id) {
        dispatch(saveView(currentState)); // This will make sure that changes to the view will applied to the list as well.
    }

}, state => state.view.present);

// Add new view when it is created and delete view when it is deleted.
registerHandler(({currentState, previousState}) => {
    
    if (previousState.loaded) {
        const newViews = currentState.all.filter(v1 => !previousState.all.some(v2 => v1.id === v2.id));
        newViews.forEach(v => {
            api.saveView(v);
        });

        const removedViews = previousState.all.filter(v1 => !currentState.all.some(v2 => v1.id === v2.id));
        removedViews.forEach(v => {
            api.deleteView(v);
        });
    }

}, state => state.views);

store.subscribe(handleStateChange);