import { useEffect } from "react";
import { useState } from "react";
import useElementPlacement from "../../hooks/useElementPlacement"
import { formAsDialog, useDialogState } from "../Dialog";

export default function Element({element, tool, sectionGrid, optionsForm, onChange, children}) {
    const [hasFocus, setHasFocus] = useState(false);
    const [localTool, setLocalTool] = useState(null);
    const [domElement, setDomElement] = useState(null)

    const { placementStyles } = useElementPlacement(element);

    const optionsDialogState = useDialogState();

    useEffect(() => {
        if (!!tool && !!domElement && !! sectionGrid) {
            setLocalTool(tool.bind(element, domElement, sectionGrid, onChange));
        }       

    }, [tool, domElement, element, sectionGrid, onChange])


    const handlePointerDown = event => {
        event.stopPropagation();

        if (hasFocus) {
            if (event.target.closest('.element__tool-buttons')) {
                return;
            }

            localTool?.onPointerDown(event);
        }
    }

    const handlePointerMove = event => {
        if (hasFocus) {
            localTool?.onPointerMove(event);
        }
    }

    const handlePointerUp = event => {
        if (hasFocus) {
            localTool?.onPointerUp(event);
        }
    }

    const handleFocus = event => {
        setHasFocus(true);
        localTool?.onFocus(event);
    }

    const handleBlur = event => {
        setHasFocus(false);
        localTool?.onBlur(event);
    }

    const handleShowOptionsDialog = async event => {
        const options = await optionsDialogState.show();
        onChange({...element, ...options});
        domElement.blur();
    }

    const ElementOptionsDialog = formAsDialog(optionsForm);

    return <div className="element" tabIndex={0} style={placementStyles} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onFocus={handleFocus} onBlur={handleBlur} ref={setDomElement}>
        <div className="element__tool-buttons">
            {optionsForm && <button className="button tool-button" title="Options" onClick={handleShowOptionsDialog}><i className="fas fa-ellipsis-v"></i></button>}
        </div>
        {children}

        {optionsForm && <ElementOptionsDialog elementOptions={element} dialogState={optionsDialogState}/>}
    </div>
}


