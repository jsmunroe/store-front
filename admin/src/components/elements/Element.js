import uuid from "react-uuid";
import useElementPlacement from "../../hooks/useElementPlacement"

export default function Element({element, sectionGrid, onResize, children}) {
    const { placementStyles } = useElementPlacement(element);
    
    return <div className="element" style={{...placementStyles}} ref={enableResize(element, sectionGrid, onResize)}>
        {children}
    </div>
}

const handlerCache = { };

function enableResize(element, sectionGrid, onResize) {
    let target = null;
    let section = null;

    let targetHandles = { 
        top: false,
        left: false,
        bottom: false,
        right: false,
    };

    element.top = element.top ?? 0;
    element.left = element.left ?? 0;

    let sectionRect = null;
    let sectionColumnGap = 0;
    let sectionRowGap = 0;
    let pointerDownRect = null;
    let snappedColumnIndex = -1;
    let snappedRowIndex = -1;

    let leftSnapPositions = [];
    let rightSnapPositions = [];
    let topSnapPositions = [];
    let bottomSnapPositions = [];

    const handleThreshold = 15;
    const resizeSnapThreshold = 20;
    
    return element => {
        if (!element || !sectionGrid) {
            return;
        }

        // Unbind previous tool associations.
        if (element.dataset.resizeToolId) {
            const unbind = handlerCache[element.dataset.resizeToolId];
            if (typeof unbind === 'function') {
                unbind();
            }
        }
        
        target = element;
        section = element.closest('.section');

        if (!section) {
            throw new Error('Cannot find parent section element.');
        }

        element.addEventListener('pointerdown', onPointerDown);
        element.addEventListener('pointermove', onPointerMove);
        element.addEventListener('pointerup', onPointerUp);

        // Create unbind callback for this binding.
        const toolId = uuid();
        element.dataset.resizeToolId = toolId;
        handlerCache[toolId] = () => {
            element.removeEventListener('pointerdown', onPointerDown);
            element.removeEventListener('pointermove', onPointerMove);
            element.removeEventListener('pointerup', onPointerUp);
        }
    };

    function onPointerDown(event) {
        const sectionStyle = window.getComputedStyle(section);
        sectionColumnGap = parseFloat(sectionStyle.columnGap);
        sectionRowGap = parseFloat(sectionStyle.rowGap);
        sectionRect = section.getBoundingClientRect();

        const { clientX, clientY } = getPointer(event);
        
        pointerDownRect = getRect(target);
        targetHandles = getHandles(clientX, clientY, pointerDownRect);
        target.setPointerCapture(event.pointerId);
        target.classList.add('element--no-transition');

        updateSnapPositions();
    }
    
    function onPointerMove(event) {
        event.preventDefault();

        sectionRect = section.getBoundingClientRect();

        let { clientX, clientY } = getPointer(event);

        if (target.hasPointerCapture(event.pointerId)) {      

            ({ clientX, clientY } = snap(clientX, clientY));

            if (targetHandles.top) {
                target.style.marginTop = `${clientY - pointerDownRect.top}px`;
            }

            if (targetHandles.left) {
                target.style.marginLeft = `${clientX - pointerDownRect.left}px`;
            }

            if (targetHandles.right) {
                target.style.marginRight = `${pointerDownRect.right - clientX}px`;
            }

            if (targetHandles.bottom) {
                target.style.marginBottom = `${pointerDownRect.bottom - clientY}px`;
            }
        } 
        else {
            const { clientX, clientY } = getPointer(event);

            const targetRect = getRect(target);
            const handles = getHandles(clientX, clientY, targetRect)
            updateHandleType(handles);
        }
    }
    
    function onPointerUp(event) {
        target.style.marginTop = null;
        target.style.marginLeft = null;
        target.style.marginRight = null;
        target.style.marginBottom = null;

        target.releasePointerCapture(event.pointerId);
        setTimeout(() => target.classList.remove('element--no-transition'), 0);

        const updatedElement = updateElementPosition(element);
        if (updatedElement) {
            onResize(updatedElement);
        }
    }

    function getHandles(clientX, clientY, targetRect) {
        return {
            top: Math.abs(clientY - targetRect.top) < handleThreshold,
            left: Math.abs(clientX - targetRect.left) < handleThreshold,
            bottom: Math.abs(clientY - targetRect.bottom) < handleThreshold,
            right: Math.abs(clientX - targetRect.right) < handleThreshold,
        };

    }

    function getPointer(event) {
        return {
            clientX: event.clientX - sectionRect.x,
            clientY: event.clientY - sectionRect.y,
        }
    }

    function getRect(element) {
        const rect = element.getBoundingClientRect();

        return {
            ...rect, 
            top: rect.top - sectionRect.y,
            left: rect.left - sectionRect.x,
            right: rect.right - sectionRect.x,
            bottom: rect.bottom - sectionRect.y,
        }
    }

    function snap(clientX, clientY) {
        const { top, left, right, bottom } = targetHandles;
        
        if (top || bottom) {
            const rows = top ? topSnapPositions : bottomSnapPositions;

            const rowIndex = rows.findIndex(row => Math.abs(row - clientY) < resizeSnapThreshold);
            if (rowIndex !== -1) {
                clientY = rows[rowIndex];

                snappedRowIndex = rowIndex + (top ? 0 : 1); // To include the zeroth row if bottom handle is active.
                console.log(`snapped to row ${snappedRowIndex}`);
            } 
            else {
                snappedRowIndex = -1;
                console.log(`unsnapped from row`);

            }
        }

        if (left || right) {
            const columns = left ? leftSnapPositions : rightSnapPositions;

            const columnIndex = columns.findIndex(column => Math.abs(column - clientX) < resizeSnapThreshold);
            if (columnIndex !== -1) {
                clientX = columns[columnIndex];

                snappedColumnIndex = columnIndex + (left ? 0 : 1); // To include the zeroth column if bottom handle is active.
                console.log(`snapped to column ${snappedColumnIndex}`);
            }
            else {
                snappedColumnIndex = -1;
                console.log(`unsnapped from column`);
            }
        }

        return { clientX, clientY };
    }

    function updateSnapPositions() {
        const halfColumnGap = sectionColumnGap / 2;
        const halfRowGap = sectionRowGap / 2;
        leftSnapPositions = [-halfColumnGap, ...sectionGrid.columns].map(position => position + halfColumnGap);
        rightSnapPositions = [...sectionGrid.columns, sectionRect.width].map(position => position - halfColumnGap);;
        topSnapPositions = [-halfRowGap, ...sectionGrid.rows].map(position => position + halfRowGap);;
        bottomSnapPositions = [...sectionGrid.rows, sectionRect.height].map(position => position - halfRowGap);;
    }

    function updateHandleType({top, left, bottom, right}) {
        if ((top && left) || (bottom && right)) {
            target.style.cursor = 'nwse-resize';
            return;
        }

        if ((top && right) || (bottom && left)) {
            target.style.cursor = 'nesw-resize';
            return;
        }

        if (top || bottom) {
            target.style.cursor = 'ns-resize';
            return;
        }

        if (left || right) {
            target.style.cursor = 'ew-resize';
            return;
        }

        target.style.cursor = null;
    }

    function updateElementPosition() {
        let position = element;

        if (targetHandles.top && snappedRowIndex >= 0) {
            const bottom = element.top + element.height;
            position = {
                ...position, 
                top: snappedRowIndex,
                height: bottom - snappedRowIndex,
            };
        }

        if (targetHandles.bottom && snappedRowIndex >= 0) {
            position = {
                ...position, 
                height: snappedRowIndex - element.top
            };
        }

        if (targetHandles.left && snappedColumnIndex >= 0) {
            const right = element.left + element.width;
            position = {...position, 
                left: snappedColumnIndex, 
                width: right - snappedColumnIndex
            };
        }

        if (targetHandles.right && snappedColumnIndex >= 0) {
            position = {
                ...position, 
                width: snappedColumnIndex - element.left
            };
        }

        return (position === element) ? null : position;
    }
}

