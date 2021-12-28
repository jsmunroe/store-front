import _ from 'lodash';

export function uniform(size, element) {
    return new Array(size).fill(element);
}

export function range(start, end, step) {
    return _.range(start, end, step);
}