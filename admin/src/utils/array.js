import _ from 'lodash';

export function uniform(size, element) {
    return new Array(size).fill(element);
}

export function range(start, end, step) {
    return _.range(start, end, step);
}

// Get the element in the array that is closest to (lowest cost between)
//  the given element. Closeness is defined by the cost function argument.
export function closest(array, value, cost = (a, b) => Math.abs(a - b)) {
    return array.reduce((prev, curr) => cost(curr, value) < cost(prev, value) ? curr : prev);
}

// Get the index of the element in the array that is closest to (lowest cost between) 
// the given element. Closeness is defined by the cost function argument.
export function closestIndex(array, value, cost = (a, b) => Math.abs(a - b)) {
    let bestValue = array[0] ?? null;
    let bestCost = cost(bestValue, value);
    let bestIndex = array.length ? 0 : -1;

    for (let i = 1; i < array.length; i++) {
        const element = array[i];
        
        const currentCost = cost(element, value) 

        if (currentCost < bestCost) {
            bestValue = element;
            bestIndex = i;
            bestCost = currentCost;
        }
    }

    return bestIndex;
}
