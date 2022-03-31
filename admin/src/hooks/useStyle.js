import { useCallback, useRef, useState } from "react";

export default function useStyle() {
    const [style, setStyle] = useState();

    const ref = useRef();
    const observerRef = useRef();

    const setRef = useCallback(node => {
        const getStyles = () => {
            if (node) {
                const style = getComputedStyle(node);
                setStyle({...style});
            }
        }          

        if (!observerRef.current) {
            observerRef.current = new ResizeObserver(getStyles);
        }

        if (ref.current) {
            observerRef.current.unobserve(ref.current);
        }

        if (node) {
            observerRef.current.observe(node);
            getStyles();
        }

        ref.current = node;
    }, [])    


    return {...style, ref: setRef};
}