export function capitalize(value) {
    return value?.replace(/(\b\w)/g, x => x?.toUpperCase());
}

export function formatNumber(number, decimals=0) {
    return parseFloat(number).toFixed(decimals).toLocaleString();
}

export function formatBytes(bytes) {
    if (bytes < 1024) {
        return `${bytes} bytes`;
    }

    if (bytes < 1024 ** 2) {
        return `${formatNumber(bytes/1024, 2)} KiB`;
    }

    if (bytes < 1024 ** 3) {
        return `${formatNumber(bytes/1024 ** 2, 2)} MiB`;
    }

    if (bytes < 1024 ** 4) {
        return `${formatNumber(bytes/1024 ** 3, 2)} GiB`;
    }

    return `${formatNumber(bytes/1025 ** 4)} TiB`;
}