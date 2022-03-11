import { createViewEditor } from '../../models/createViewEditor';
import { addIfMissing, combine, removeIfPresent, saveElement } from '../../utils/mutate';
import { createReducer } from '../../utils/reduxHelpers';
import * as actionTypes from '../actions/actionTypes';
import initialState from './initialState';

export default createReducer({
    [actionTypes.loadView]: function (state, {view}) {
        // Change the state only if the loaded view is a different view.
        return state.view.id === view.id ? state : createViewEditor(view);
    },

    [actionTypes.saveView]: function (state, {view}) {
        // Change the state only if the view has changed.
        return state.view === view ? state : {...state, view};
    },

    [actionTypes.selectElement]: function (state, {element, isGroupSelect}) {
        const selectedElements = isGroupSelect ? addIfMissing(state.selectedElements, element) : [element];

        // Change the state only if the selectedElements list has changed.
        return state.selectedElements === selectedElements ? state : {...state, selectedElements};
    },

    [actionTypes.deselectElement]: function (state, {element, isGroupSelect}) {
        const selectedElements = isGroupSelect ? removeIfPresent(state.selectedElements, element) : [];

        // Change the state only if the selectedElements list has changed.
        return state.selectedElements === selectedElements ? state : {...state, selectedElements};
    },
    
    [actionTypes.clearSelectedElements]: function (state) {
        // Change the state only if the selectedElements list was not already empty.
        return !state.selectedElements.length ? state : {...state, selectedElements: []};
    },

    [actionTypes.addElements]: function (state, {elements, dispatch}) {
        elements = combine(state.view.elements, elements);

        // Change the view only if the view's elements list has changed.
        const view = state.view.elements === elements ? state.view : {...state.view, elements};

        // Change the state only if the view has changed.
        state = state.view === view ? state : {...state, view };

        dispatch({type: actionTypes.saveView, view});

        return state;
    },

    [actionTypes.saveElement]: function (state, {element, dispatch}) {
        const elements = saveElement(state.view.elements, element);

        // Change the view only if the view's elements list has changed.
        const view = state.view.elements === elements ? state.view : {...state.view, elements};

        // Change the state only if the view has changed.
        state = state.view === view ? state : {...state, view };

        dispatch({type: actionTypes.saveView, view});

        return state;
    }

}, initialState.viewEditor)