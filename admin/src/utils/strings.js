export function capitalize(value) {
    return value?.replace(/(\b\w)/g, x => x?.toUpperCase());
}