import uuid from 'react-uuid';

const defaultElementByType = {
    text: element => ({...element, 
        fontSize: 16,
        horizontalAlign: 'left',
        verticalAlign: 'top'
    }),
};

export function createElement(type, bounds) {
    let element = {
        id: uuid(),
        type: type,
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height
    };

    const defaultElement = defaultElementByType[type] ?? (element => element);

    return defaultElement(element);
}