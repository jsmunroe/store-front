export function times(count, callback) {
    return [...Array(count)].map(callback);
}
