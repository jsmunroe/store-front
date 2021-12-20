
export function toValue(handler) {
    return event => {
        handler && handler(event.target.value);
    }
}

export function toNumberValue(handler) {
    return event => {
        handler && handler(event.target.value * 1);
    }
}

export function toNameValue(handler) {
    return event => {
        handler && handler(event.target.name, event.target.value);
    }
}

export function toNumberNameValue(handler) {
    return event => {
        handler && handler(event.target.name, event.target.value * 1);
    }
}
