import { createReducer } from '../../utils/reduxHelpers';
import * as actionTypes from '../actions/actionTypes';
import initialState from './initialState';
import _ from 'lodash';

export default createReducer({
    [actionTypes.loadViews]: function (state, {views}) {
        return {
            loaded: true,
            all: _.sortBy([...views], v => v.name),
        };
    },

    [actionTypes.saveView]: function (state, {view}) {
        if (state.all.find(v => v.id === view.id)) {
            return {...state,
                all: state.all.map(v => v.id === view.id ? view : v)
            };
        }

        return {...state, 
            all: _.sortBy([...state.all, view], v => v.name) 
        };
    },

}, initialState.views)