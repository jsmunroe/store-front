import { useEffect } from "react";
import { useState } from "react";
import useElementPlacement from "../../hooks/useElementPlacement"
import { useDialog } from "../Dialog";

export default function ElementBase({element, tool, sectionGrid, optionsForm, onChange, children}) {
    const [hasFocus, setHasFocus] = useState(false);
    const [localTool, setLocalTool] = useState(null);
    const [domElement, setDomElement] = useState(null)

    const { placementStyles } = useElementPlacement(element,sectionGrid);

    const dialog = useDialog();

    useEffect(() => {
        if (!!tool && !!domElement && !! sectionGrid) {
            setLocalTool(tool.bind(element, domElement, sectionGrid, onChange));
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

    const handleShowOptionsDialog = async event => {
        const OptionsForm = optionsForm;
        const options = await dialog.show(props => <OptionsForm elementOptions={element} {...props}/> );

        if (options) {
            onChange({...element, ...options});
            domElement.blur();
        }
    }

    return <div className="element" tabIndex={0} style={{...placementStyles}} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onFocus={handleFocus} onBlur={handleBlur} ref={setDomElement}>
        <div className="element__tool-buttons">
            {optionsForm && <button className="button tool-button" title="Options" onClick={handleShowOptionsDialog}><i className="fas fa-ellipsis-v"></i></button>}
        </div>
        {children}
    </div>
}


