import uuid from 'react-uuid';

export function createElement(type, bounds) {
    return             {
        id: uuid(),
        type: type,
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height
    };
}