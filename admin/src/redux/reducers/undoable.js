import * as actionTypes from '../actions/actionTypes'

// See: https://redux.js.org/usage/implementing-undo-history

const defaultUndoConfig = {
    recordable: [],
    contextSwitch: null,
    getKey: state => state,
    saveActions: [],
};

export function undoable(reducer, config = defaultUndoConfig) {
    const initialState = {
        past: [],
        present: reducer(undefined, {}), // Call reducer with empty action to populate the initial state.
        future: [],
        contexts: {}
    }

    // Return a reducer that handles undo and redo.
    return function (state = initialState, action) {
        switch (action.type) {
            case actionTypes.undo: {
                const { past, present, future, contexts } = state;

                const previous = past[past.length - 1];
                const newPast = past.slice(0, past.length - 1);

                config.saveActions.forEach(sa => {
                    action.dispatch(sa(previous)); // This dispatch call will invoke after the current dispatch has ended.
                });

                return {
                    past: newPast,
                    present: previous,
                    future: [present, ...future],
                    contexts,
                }
            }
            case actionTypes.redo: {
                const { past, present, future, contexts } = state;
                
                const next = future[0];
                const newFuture = future.slice(1);

                config.saveActions.forEach(sa => {
                    action.dispatch(sa(next)); // This dispatch call will invoke after the current dispatch has ended.
                });

                return {
                    past: [...past, present],
                    present: next,
                    future: newFuture,
                    contexts,
                }
            }
            case actionTypes.clearHistory: {               
                return {
                    ...state,
                    past: [],
                    future: [],
                }
            }
            default: {
                let { past, present, contexts } = state;

                const newPresent = reducer(present, action);

                if (config.contextSwitch === action.type) {
                    const key = config.getKey(present);
                    if (key) {
                        contexts = {...contexts, [key]:{...state, contexts: undefined}};
                    }

                    const newKey = config.getKey(newPresent);
                    const newContext = contexts[newKey] ?? initialState;

                    return {...newContext, present: newPresent, contexts};
                }

                if (present === newPresent) {
                    return state;
                }

                if (!config.recordable.includes(action.type)) {
                    return {...state, present: newPresent};
                }

                return {
                    past: [...past, present],
                    present: newPresent,
                    future: [],
                    contexts,
                }     
            }    
        }
    }
}

export function toState(state) {
    return state.present;
}

export function toUndo(state) {
    return {
        past: [],
        present: state,
        future: [],
        contexts: {},
    }
}