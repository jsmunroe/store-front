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
        let { all } = state;

        let found = all.find(v => v.id === view.id)
        if (!found) {
            all = [...all, view];
            return {...state, all};
        }

        if (found !== view) {
            all = all.map(v => v.id === view.id ? view : v);
            return {...state, all};
        }

        return state;
    },

    [actionTypes.removeView]: function (state, {view}) {
        let { all } = state;

        if (all.some(v => v.id === view.id)) {
            all = all.filter(v => v.id !== view.id);
            return {...state, all};
        }

        return state;
    }

}, initialState.views)