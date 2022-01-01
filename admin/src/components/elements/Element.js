import { useEffect } from "react";
import { useState } from "react";
import useElementPlacement from "../../hooks/useElementPlacement"

export default function Element({element, tool, sectionGrid, onChange, children}) {
    const [localTool, setLocalTool] = useState(null);
    const [domElement, setDomElement] = useState(null)
    const { placementStyles } = useElementPlacement(element);

    useEffect(() => {
        if (!!tool && !!domElement && !! sectionGrid) {
            setLocalTool(tool.bind(element, domElement, sectionGrid, onChange));
        }       

    }, [tool, domElement, element, sectionGrid, onChange])

    const handlePointerDown = event => {
        localTool?.onPointerDown(event);
    }

    const handlePointerMove = event => {
        localTool?.onPointerMove(event);
    }

    const handlePointerUp = event => {
        localTool?.onPointerUp(event);
    }

    return <div className="element" style={placementStyles} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} ref={setDomElement}>
        {children}
    </div>
}


