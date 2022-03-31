import { useCallback, useRef, useState } from "react";

function getInnerBounds(node) {
    const style = getComputedStyle(node);

    return [
        node.clientWidth - parseInt(style.paddingLeft) - parseInt(style.paddingRight), 
        node.clientHeight - parseInt(style.paddingTop) - parseInt(style.paddingBottom),
    ];
}

export default function useBounds() {
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();

    const ref = useRef();
    const observerRef = useRef();

    const setRef = useCallback(node => {
        const getBounds = () => {
            if (node) {
                const [width, height] = getInnerBounds(node);
                setWidth(width);
                setHeight(height);
            }
        }          

        if (!observerRef.current) {
            observerRef.current = new ResizeObserver(getBounds);
        }

        if (ref.current) {
            observerRef.current.unobserve(ref.current);
        }

        if (node) {
            observerRef.current.observe(node);
            getBounds();
        }

        ref.current = node;
    }, [])    


    return {width, height, ref: setRef};
}