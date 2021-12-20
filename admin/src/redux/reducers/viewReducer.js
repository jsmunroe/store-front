import { createReducer } from '../../utils/reduxHelpers';
import * as actionTypes from '../actions/actionTypes';
import initialState from './initialState';

export default createReducer({

    [actionTypes.loadView]: function (state, {view}) {
        return {...view};
    },

    [actionTypes.saveView]: function (state, {view}) {
        return {...view};
    }

}, initialState.views)