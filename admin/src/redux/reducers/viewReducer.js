import { createReducer } from '../../utils/reduxHelpers';
import * as actionTypes from '../actions/actionTypes';
import { saveView } from '../actions/viewActions';
import initialState from './initialState';
import { undoable } from "./undoable";

const reducer = createReducer({

    [actionTypes.loadView]: function (state, {view}) {
        return state.id === view.id ? state : view;
    },

    [actionTypes.saveView]: function (state, {view}) {
        return state.id === view.id ? view : state;
    }

}, initialState.view);

const undoConfig = {
    recordable: [actionTypes.saveView],
    contextSwitch: actionTypes.loadView,
    getKey: state => state.id,
    saveActions: [saveView],
}

export default undoable(reducer, undoConfig);