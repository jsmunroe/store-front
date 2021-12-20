import uuid from 'react-uuid';

export function create() {
    return {
        id: uuid(),
        name: 'Untitled View',
    };
}