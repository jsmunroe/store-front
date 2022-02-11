function byId(e1, e2) {
    return typeof e1?.id !== 'undefined' && typeof e2?.id !== 'undefined' && e1.id === e2.id;
}

// Save an element if it exists within the given array, otherwise, 
//  push it on to the end of the array.
function saveElement(array, element, match = byId) {   
    if (!array || !array.length) {
        return [element];
    }

    if (!element) {
        return array;
    }

    const result = new  Array(array.length);
    let found = false;

    for (let i = 0; i < array.length; i++) {
        const existing = array[i];
        
        if (match(element, existing)) {
            result[i] = element;
            found = true;
        } else {
            result[i] = existing;
        }
    }
    
    if (!found) {
        result.push(element);
    }
    
    return result;
}