import { useState } from "react";
import { connect } from "react-redux";
import useElementPlacement from "../../hooks/useElementPlacement"
import { bindActionCreators } from "redux";
import { useModal } from "../Modal";
import * as viewEditorActions from '../../redux/actions/viewEditorActions'
import useChange from "../../hooks/useChange";
import { useClass } from "../../utils/htmlHelpers";

function ElementBase({element, isSelected, tool, grid, optionsForm, actions, children}) {
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

    const handlePointerDown = event => {
        localTool?.onPointerDown(event);

        actions.selectElement(element, event.ctrlKey);
    }

    const handlePointerMove = event => {
        localTool?.onPointerMove(event);
    }

    const handlePointerUp = event => {
        localTool?.onPointerUp(event);
    }

    const handleFocus = event => {
        localTool?.onFocus(event);
    }

    const handleBlur = event => {
        localTool?.onBlur(event);
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
        actions.removeElements([element]);
    }

    return <div className={`element ${useClass(isSelected, 'element--selected')}`} tabIndex={-1} data-id={element.id} style={{...placementStyles}} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onFocus={handleFocus} onBlur={handleBlur} onDoubleClick={handleShowOptionsDialog} ref={setDomElement}>
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