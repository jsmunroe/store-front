import useElementPlacement from "../../hooks/useElementPlacement"

export default function Element({top, left, width, height, sectionGrid, onResize, children}) {
    const { placementStyles } = useElementPlacement({top, left, width, height});
    
    return <div className="element" style={{...placementStyles}} ref={enableResize(top, left, width, height, sectionGrid, onResize)}>
        {children}
    </div>
}

function enableResize(top, left, width, height, sectionGrid, onResize) {
    let target = null;

    let targetHandles = { 
        top: false,
        left: false,
        bottom: false,
        right: false,
    };

    let pointerDownRect = null;

    const handleThreshold = 15;
    
    return element => {
        if (!element) {
            return;
        }

        target = element;

        element.addEventListener('pointerdown', onPointerDown);
        element.addEventListener('pointermove', onPointerMove);
        element.addEventListener('pointerup', onPointerUp);
        element.addEventListener('pointerleave', onPointerLeave);
        
    };

    function onPointerDown(event) {
        pointerDownRect = target.getBoundingClientRect();
        targetHandles = getHandles(event, pointerDownRect);
        target.setPointerCapture(event.pointerId);
    }
    
    function onPointerMove(event) {
        event.preventDefault();

        const targetRect = target.getBoundingClientRect();
        
        const handles = getHandles(event, targetRect);
        updateHandleType(handles);

        if (target.hasPointerCapture(event.pointerId)) {
            if (handles.top) {
                target.style.marginTop = `${event.clientY - pointerDownRect.top}px`;
            }

            if (handles.left) {
                target.style.marginLeft = `${event.clientX - pointerDownRect.left}px`;
            }

            if (handles.right) {
                target.style.marginRight = `${pointerDownRect.right - event.clientX}px`;
            }

            if (handles.bottom) {
                target.style.marginBottom = `${pointerDownRect.bottom - event.clientY}px`;
            }
        }
    }
    
    function onPointerUp(event) {
        target.style.marginTop = null;
        target.style.marginLeft = null;
        target.style.marginRight = null;
        target.style.marginBottom = null;
        target.releasePointerCapture(event.pointerId);
    }

    function onPointerLeave(event) {
        target.style.cursor = null;
    }

    function getHandles(event, targetRect) {
        return {
            top: Math.abs(event.clientY - targetRect.top) < handleThreshold,
            left: Math.abs(event.clientX - targetRect.left) < handleThreshold,
            bottom: Math.abs(event.clientY - targetRect.bottom) < handleThreshold,
            right: Math.abs(event.clientX - targetRect.right) < handleThreshold,
        };

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
}

