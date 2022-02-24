
export function useClass(shouldUse, className) {
    return shouldUse ? className : '';
}

export function toValue(handler) {
    return event => {
        event.target?.setCustomValidity && event.target?.setCustomValidity('');

        if (typeof handler === 'function') {
            const validity = handler(event.target.value, event);

            if (typeof validity === 'string') {
                event.target?.setCustomValidity(validity);
            }
        }
    }
}

export function toNumberValue(handler) {
    return event => {
        event.target?.setCustomValidity('');

        if (typeof handler === 'function') {
            const value = event.target.value * 1;
            if (isNaN(value)) {
                return 'Value is not a number.';
            }

            const validity = handler(value, event);

            if (typeof validity === 'string') {
                event.target?.setCustomValidity(validity);
            }
        }
    }
}

export function toNameValue(handler) {
    return event => {
        event.target?.setCustomValidity('');

        if (typeof handler === 'function') {
            const validity = handler(event.target.name, event.target.value, event);

            if (typeof validity === 'string') {
                event.target?.setCustomValidity(validity);
            }
        }
    }
}

export function toNameIsChecked(handler) {
    return event => {
        event.target?.setCustomValidity('');

        if (typeof handler === 'function') {
            const validity = handler(event.target.name, event.target.checked, event);

            if (typeof validity === 'string') {
                event.target?.setCustomValidity(validity);
            }
        }
    }
}

export function toNumberNameValue(handler) {
    return event => {
        event.target?.setCustomValidity('');

        if (typeof handler === 'function') {
            const value = event.target.value * 1;
            if (isNaN(value)) {
                return 'Value is not a number.';
            }

            const validity = handler(event.target.name, value, event);

            if (typeof validity === 'string') {
                event.target?.setCustomValidity(validity);
            }
        }
    }
}

// Replace the default behavior of the event with the given handler.
export function replace(handler) {
    return event => {
        event.preventDefault();
        typeof handler === 'function' && handler(event);
    }
}

export function sanitize(text) {
    if (!text) {
        return '';
    }

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return text.replace(reg, (match)=>(map[match]));
}

export function unsanitize(text) {
    if (!text) {
        return '';
    }

    const map = {
        '&amp;' : '&',
        '&lt;'  : '<',
        '&gt;'  : '>',
        '&quot;': '"',
        '&#x27;': "'",
        '&#x2F;': "/",
    };
    const reg = /&[#\w\d]+;/ig;
    return text.replace(reg, (match)=>(map[match]));
}

export function newLinesToBreaks(text) {
    return text.replace(/(\r\n|\r|\n)/, '<br/>');
}

export function breaksToNewLines(text) {
    return text.replace(/<br\s*\/?>/i, '\r\n');  
}