import * as actionTypes from './actionTypes';

export function selectElements(elements, isGroupSelect) {
    return { type: actionTypes.selectElements, elements, isGroupSelect };
}

export function deselectElements(elements, isGroupSelect) {
    return { type: actionTypes.deselectElements, elements, isGroupSelect };
}

export function selectAllElements() {
    return { type: actionTypes.selectAllElements };
}

export function clearSelectedElements() {
    return { type: actionTypes.clearSelectedElements };
}

export function addElements(elements) {
    return { type: actionTypes.addElements, elements };
}

export function removeElements(elements) {
    return { type: actionTypes.removeElements, elements };
}

export function saveElement(element) {
    return { type: actionTypes.saveElement, element }; 
}