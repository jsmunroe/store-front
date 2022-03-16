import { useEffect } from "react";

class binding {
    constructor(codes) {
        this.codes = Array.isArray(codes) ? codes : [codes];
        this.control = false;
        this.handlers = [];
    }

    withControl() {
        this.control = true;
        return this;
    }

    withShift() {
        this.shift = true;
        return this;
    }

    bind(handler) {
        if (typeof handler === 'function') {
            this.handlers = [...this.handlers, handler];
        }
        return this;
    }

    if(predicate) {
        this.predicate = typeof predicate === 'function' ? predicate : null;
        return this;
    }

    check(event) {
        if (!this.codes.includes(event.code)) {
            return false;
        }

        if (this.control && !event.ctrlKey) {
            return false;
        }

        if (this.shift && !event.shiftKey) {
            return false;
        }

        if (this.predicate && !this.predicate(event)) {
            return false;
        }

        return true;
    }

    do(event) {
        if (this.check(event)) {
            event.preventDefault();
            event.stopPropagation();
            this.handlers.forEach(h => h(event));
        }
    }
}

export function key(...codes) {
    return new binding(codes);
}

export function useKeyBindings(...bindings) {
    useEffect(() => {
        const onKeyDown = event => {
            bindings.forEach(binding => binding.do(event));
        }

        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        }
    }, [bindings])
}