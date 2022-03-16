import { createViewEditor } from '../../models/createViewEditor';
import { addIfMissing, combine, extract, removeIfPresent, saveElement } from '../../utils/mutate';
import { createReducer } from '../../utils/reduxHelpers';
import * as actionTypes from '../actions/actionTypes';
import initialState from './initialState';

export default createReducer({
    [actionTypes.loadView]: function (state, {view}) {
        // Mutate the state only if the loaded view is a different view.
        return state.view.id === view.id ? state : createViewEditor(view);
    },

    [actionTypes.saveView]: function (state, {view}) {
        // Mutate the state only if the view has changed.
        return state.view === view ? state : {...state, view};
    },

    [actionTypes.selectElement]: function (state, {element, isGroupSelect}) {
        const selectedElements = isGroupSelect ? addIfMissing(state.selectedElements, element) : [element];

        // Mutate the state only if the selectedElements list has changed.
        return state.selectedElements === selectedElements ? state : {...state, selectedElements};
    },

    [actionTypes.deselectElement]: function (state, {element, isGroupSelect}) {
        const selectedElements = isGroupSelect ? removeIfPresent(state.selectedElements, element) : [];

        // Mutate the state only if the selectedElements list has changed.
        return state.selectedElements === selectedElements ? state : {...state, selectedElements};
    },
    
    [actionTypes.selectAllElements]: function (state) {
        const selectedElements = combine(state.selectedElements, state.view.elements);

        // Mutate the state only if the selectedElements list has changed.
        return state.selectedElements === selectedElements ? state : {...state, selectedElements};
    },

    [actionTypes.clearSelectedElements]: function (state) {
        // Mutate the state only if the selectedElements list was not already empty.
        return !state.selectedElements.length ? state : {...state, selectedElements: []};
    },

    [actionTypes.addElements]: function (state, {elements, dispatch}) {
        elements = combine(state.view.elements, elements);

        // Mutate the view only if the view's elements list has changed.
        const view = state.view.elements === elements ? state.view : {...state.view, elements};

        // Mutate the state only if the view has changed.
        if (state.view === view) {
            return state; // Nothing changed.
        }

        state = {...state, view };

        dispatch({type: actionTypes.saveView, view});

        return state;
    },

    [actionTypes.removeElements]: function (state, {elements, dispatch}) {
        elements = extract(state.view.elements, elements);

        // Mutate the view only if the view's elements list has changed.
        const view = state.view.elements === elements ? state.view : {...state.view, elements};

        // Mutate the state only if the view has changed.
        if (state.view === view) {
            return state; // Nothing has changed.
        }

        state = state.view === view ? state : {...state, view };

        dispatch({type: actionTypes.saveView, view});

        return state;
    },

    [actionTypes.saveElement]: function (state, {element, dispatch}) {
        const elements = saveElement(state.view.elements, element);

        // Mutate the view only if the view's elements list has changed.
        const view = state.view.elements === elements ? state.view : {...state.view, elements};

        // Mutate the state only if the view has changed.
        state = state.view === view ? state : {...state, view };

        dispatch({type: actionTypes.saveView, view});

        return state;
    }

}, initialState.viewEditor)