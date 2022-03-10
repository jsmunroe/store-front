export function bindKeyEvents(handler) {
    const onKeyDown = event => handler(event);

    document.addEventListener('keydown', onKeyDown);

    return () => { 
        document.removeEventListener('keydown', onKeyDown);
    }
}

export function stop(event) {
    event.preventDefault();
    event.stopPropagation();
}