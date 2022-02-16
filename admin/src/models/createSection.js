import uuid from 'react-uuid';

export function createSection() {
    return {
        id: uuid(),
        columns: 12,
        rows: 12
    }
}