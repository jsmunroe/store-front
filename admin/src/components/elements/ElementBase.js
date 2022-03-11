import { useState } from "react";
import { connect } from "react-redux";
import useElementPlacement from "../../hooks/useElementPlacement"
import { bindActionCreators } from "redux";
import { useModal } from "../Modal";
import * as viewEditorActions from '../../redux/actions/viewEditorActions'
import useChange from "../../hooks/useChange";
import { key, useKeyBindings } from "../../hooks/useKeyBindings";

function ElementBase({element, isSelected, tool, grid, optionsForm, onRemove, actions, children}) {
    const [localTool, setLocalTool] = useState(null);
    const [domElement, setDomElement] = useState(null);

    const { placementStyles } = useElementPlacement(element,grid);

    const modal = useModal();

    function handleChange(element) {
        actions.saveElement(element);
    }

    useChange(() => {
        if (!!tool && !!domElement && !! grid) {
            setLocalTool(tool.bindToElement(element, domElement, grid, element => handleChange(element)));
        }

    }, [tool, domElement, element, grid, actions])

    useKeyBindings(
        key('Delete').if(() => isSelected).bind(event => handleRemoveRequest(event)),
    )

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
        actions.selectElement(element);
    }

    const handleBlur = event => {
        actions.deselectElement(element, true); // Setting isGroupSelect to true so we can avoid a race condition where the blur happens after the other control is focussed.
    }

    const handleShowOptionsUpdate = elementOptions => {
        
    }

    const handleShowOptionsDialog = async event => {
        const elementOptions = await modal.show(optionsForm, { elementOptions: element, onUpdate: handleShowOptionsUpdate });

        if (elementOptions) {
            handleChange({...element, ...elementOptions});
        }
    }

    const handleRemoveRequest = event => {
        onRemove(element);
    }

    return <div className="element" tabIndex={-1} data-id={element.id} style={{...placementStyles}} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onFocus={handleFocus} onBlur={handleBlur} onDoubleClick={handleShowOptionsDialog} ref={setDomElement}>
        {children}
        <div className="element__tool-buttons">
            {optionsForm && <button className="button tool-button" title="Options" onClick={handleShowOptionsDialog}><i className="fas fa-ellipsis-v fa-fw"></i></button>}
        </div>
        <div className="element__close-button">
            <button className="button tool-button" title="Remove this element." onClick={handleRemoveRequest}><i className="fas fa-times fa-fw"></i></button>
        </div>
    </div>
}

function mapStateToProps({viewEditor}, {element}) {
    return {
        isSelected: viewEditor.selectedElements.some(e => e.id === element?.id)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(viewEditorActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ElementBase);