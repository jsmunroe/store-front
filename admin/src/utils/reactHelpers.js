export function times(count, callback) {
    return [...Array(count)].map(callback);
}

export function sendRef(dom, ref) {
    if (typeof ref === 'function') {
        ref(dom);
    }
    else if (ref) {
        ref.current = dom;
    }
}