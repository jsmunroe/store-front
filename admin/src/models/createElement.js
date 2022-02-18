import uuid from 'react-uuid';

function defaultText(element) {
    return {...element, 
        fontSize: 16,
        horizontalAlign: 'left',
        verticalAlign: 'top'
    }
}

const defaultElementByType = {
    text: defaultText,
};

export function createElement(type, bounds) {
    const element = {
        id: uuid(),
        type: type,
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height
    };

    const defaultElement = defaultElementByType[type];
    if (defaultElement) {
        element = defaultElement(element);
    }
}