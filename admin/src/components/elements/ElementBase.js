import { useEffect } from "react";
import { useState } from "react";
import useElementPlacement from "../../hooks/useElementPlacement"
import { useModal } from "../Modal";

export default function ElementBase({element, tool, sectionGrid, optionsForm, onChange, children}) {
    const [, setHasFocus] = useState(false);
    const [localTool, setLocalTool] = useState(null);
    const [domElement, setDomElement] = useState(null);

    const { placementStyles } = useElementPlacement(element,sectionGrid);

    const modal = useModal();

    useEffect(() => {
        if (!!tool && !!domElement && !! sectionGrid) {
            setLocalTool(tool.bindToElement(element, domElement, sectionGrid, onChange));
        }       

    }, [tool, domElement, element, sectionGrid, onChange])

    const handlePointerDown = event => {
        event.stopPropagation();

        if (event.target.closest('.element__tool-buttons')) {
            return;
        }

        localTool?.onPointerDown(event);
    }

    const handlePointerMove = event => {
        localTool?.onPointerMove(event);
    }

    const handlePointerUp = event => {
        localTool?.onPointerUp(event);
    }

    const handleFocus = event => {
        setHasFocus(true);
        localTool?.onFocus(event);
    }

    const handleBlur = event => {
        setHasFocus(false);
        localTool?.onBlur(event);
    }

    const handleShowOptionsUpdate = elementOptions => {
        
    }

    const handleShowOptionsDialog = async event => {
        const elementOptions = await modal.show(optionsForm, { elementOptions: element, onUpdate: handleShowOptionsUpdate });

        if (elementOptions) {
            onChange({...element, ...elementOptions});
        }
    }

    return <div className="element" tabIndex={0} style={{...placementStyles}} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onFocus={handleFocus} onBlur={handleBlur} ref={setDomElement}>
        <div className="element__tool-buttons">
            {optionsForm && <button className="button tool-button" title="Options" onClick={handleShowOptionsDialog}><i className="fas fa-ellipsis-v"></i></button>}
        </div>
        {children}
    </div>
}

