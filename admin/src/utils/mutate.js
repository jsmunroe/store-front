function byId(e1, e2) {
    return typeof e1?.id !== 'undefined' && typeof e2?.id !== 'undefined' && e1.id === e2.id;
}

export function saveElementOnProperty(obj, propertyName, element, match = byId) {
    return {...obj, [propertyName]: saveElement(obj[propertyName], element, match)};
}

// Save an element if it exists within the given array, otherwise, 
//  push it on to the end of the array.
export function saveElement(array, element, match = byId) {   
    if (!array || !array.length) {
        return [element];
    }

    if (!element) {
        return array;
    }

    // If array contains this element by id but not by reference, mutate array.
    if (array.some(e => match(e, element) && e !== element)) {
        array = array.map(e => match(e, element) ? element : e);
    }
    else if (!array.some(e => match(e, element))) {
        array = [...array, element];
    }

    return array;
}

export function addIfMissing(array, element, match = byId) {
    if (!Array.isArray(array) || !array.length) {
        return [element];
    }

    // Mutate array only if necessary.
    if (!array.some(e => match(e, element))) {
        return [...array, element];
    }

    return array;
}

export function removeIfPresent(array, element, match = byId) {
    if (!Array.isArray(array) || !array.length) {
        return [];
    }

    // Mutate array only if necessary.
    if (array.some(e => match(e,element))) {
        return array.filter(e => !match(e, element));
    }

    return array;
}

export function combine(array, elements, match = byId) {
    if (!Array.isArray(array) && !Array.isArray(elements)) {
        return [];
    }

    if (!array.length && elements.length) {
        return elements;
    } 

    if (!elements.length) {
        return array;
    }

    // Mutate array only if necessary.
    if (elements.some(e => !array.some(a => match(e, a)))) {
        elements.forEach(element => {
            array = addIfMissing(array, element, match);
        })
    }

    return array;
} 