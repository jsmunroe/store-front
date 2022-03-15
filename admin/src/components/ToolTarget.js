import { useRef, useState } from "react";
import useChange from "../hooks/useChange";

export default function ToolTarget({tool, className, targetType, targetModel, grid, onUpdate, onRef, onPointerDown, onPointerMove, onPointerUp, onFocus, onBlur, children, ...props}) {
    const [toolState, setToolState] = useState(null);
    
    const targetRef = useRef();

    useChange(() => {
        if (targetRef.current && grid) {
            const ts = tool.buildState(targetModel, targetRef.current, grid, onUpdate)
            setToolState(ts);
        }
    }, [tool, grid, !onUpdate, targetModel]);

    useChange(() => {
        onRef && onRef(targetRef.current);
    }, [!onRef, targetRef.current])

    const handlePointerDown = event => {
        event.stopPropagation();

        toolState && tool.onPointerDown(toolState, event);
        onPointerDown && onPointerDown(event);
    }

    const handlePointerMove = event => {
        toolState && tool.onPointerMove(toolState, event);
        onPointerMove && onPointerMove(event);
    }

    const handlePointerUp = event => {
        toolState && tool.onPointerUp(toolState, event);
        onPointerUp && onPointerUp(event);
    }

    const handleFocus = event => {
        toolState && tool.onFocus(toolState, event);
        onFocus && onFocus(event);
    }

    const handleBlur = event => {
        toolState && tool.onBlur(toolState, event);
        onBlur && onBlur(event);
    }

    return <div className={className} ref={targetRef} data-target-type={targetType}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...props}>
        {children}
    </div>
}
