
export function useClass(shouldUse, className) {
    return shouldUse ? className : '';
}

export function toValue(handler) {
    return event => {
        typeof handler === 'function' && handler(event.target.value);
    }
}

export function toNumberValue(handler) {
    return event => {
        typeof handler === 'function' && handler(event.target.value * 1);
    }
}

export function toNameValue(handler) {
    return event => {
        typeof handler === 'function' && handler(event.target.name, event.target.value);
    }
}

export function toNumberNameValue(handler) {
    return event => {
        typeof handler === 'function' && handler(event.target.name, event.target.value * 1);
    }
}

// Replace the default behavior of the event with the given handler.
export function replace(handler) {
    return event => {
        event.preventDefault();
        typeof handler === 'function' && handler(event);
    }
}