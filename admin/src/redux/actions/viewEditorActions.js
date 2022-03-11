import * as actionTypes from './actionTypes';

export function selectElement(element, isGroupSelect) {
    return { type: actionTypes.selectElement, element, isGroupSelect };
}

export function deselectElement(element, isGroupSelect) {
    return { type: actionTypes.deselectElement, element, isGroupSelect };
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