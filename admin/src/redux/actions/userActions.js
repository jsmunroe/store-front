import * as actionTypes from './actionTypes';

export function loadUser(user) {
    return { type: actionTypes.loadUser, user };
}

export function clearUser() {
    return { type: actionTypes.clearUser };
}