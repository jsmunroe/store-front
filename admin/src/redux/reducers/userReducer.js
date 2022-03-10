import { createReducer } from '../../utils/reduxHelpers';
import * as actionTypes from '../actions/actionTypes';
import initialState from './initialState';

export default createReducer({

    [actionTypes.loadUser]: function (state, {user}) {
        return {...user};
    },

    [actionTypes.clearUser]: function (state, action) {
        return { state: 'NotAuthenticated' };
    }

}, initialState.user)