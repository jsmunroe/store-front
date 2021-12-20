import { createReducer } from '../../utils/reduxHelpers';
import * as actionTypes from '../actions/actionTypes';
import initialState from './initialState';
import _ from 'lodash';

export default createReducer({

    [actionTypes.saveView]: function (state, {view}) {
        if (state.find(v => v.id === view.id)) {
            return state.map(v => v.id === view.id ? view : v);
        }

        return _.sortBy([...state, view], v => v.name);
    },

}, initialState.views)