import { useEffect } from "react";
import { useState } from "react";
import useElementPlacement from "../../hooks/useElementPlacement"
import { bindKeyEvents } from "../../utils/domHelpers";
import { useModal, confirm } from "../Modal";

export default function ElementBase({element, tool, sectionGrid, optionsForm, isEditing, onFocus, onBlur, onChange, onRemove, children}) {
    const [hasFocus, setHasFocus] = useState(false);
    const [localTool, setLocalTool] = useState(null);
    const [domElement, setDomElement] = useState(null);

    const { placementStyles } = useElementPlacement(element,sectionGrid);

    const modal = useModal();

    useEffect(() => {
        if (!!tool && !!domElement && !! sectionGrid) {
            setLocalTool(tool.bindToElement(element, domElement, sectionGrid, onChange));
        }       

    }, [tool, domElement, element, sectionGrid, onChange])

    useEffect(() => {
        if (isEditing) {
            localTool?.disable();
        } else {
            localTool?.enable();
        }
        
    }, [localTool, isEditing])

    useEffect(() => {
        return bindKeyEvents(event => {
            if (hasFocus && event.code === 'Delete') {
                handleRemoveRequest(event);
            }
        })
    })

    const handlePointerDown = event => {
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
        onFocus(element, domElement);
    }

    const handleBlur = event => {
        setHasFocus(false);
        localTool?.onBlur(event);
        onBlur(element, domElement);
    }

    const handleShowOptionsUpdate = elementOptions => {
        
    }

    const handleShowOptionsDialog = async event => {
        const elementOptions = await modal.show(optionsForm, { elementOptions: element, onUpdate: handleShowOptionsUpdate });

        if (elementOptions) {
            onChange({...element, ...elementOptions});
        }
    }

    const handleRemoveRequest = event => {
        onRemove(element);
    }

    return <div className="element" tabIndex={-1} data-id={element.id} style={{...placementStyles}} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onFocus={handleFocus} onBlur={handleBlur} onDoubleClick={handleShowOptionsDialog} ref={setDomElement}>
        {children}
        {!isEditing && <div className="element__tool-buttons">
            {optionsForm && <button className="button tool-button" title="Options" onClick={handleShowOptionsDialog}><i className="fas fa-ellipsis-v fa-fw"></i></button>}
        </div>}
        {!isEditing && <div className="element__close-button">
            <button className="button tool-button" title="Remove this element." onClick={handleRemoveRequest}><i className="fas fa-times fa-fw"></i></button>
        </div>}
    </div>
}


