import { connect } from "react-redux";
import useElementPlacement from "../../hooks/useElementPlacement"
import { bindActionCreators } from "redux";
import { useModal } from "../Modal";
import * as viewEditorActions from '../../redux/actions/viewEditorActions'
import { useClass } from "../../utils/htmlHelpers";
import ToolTarget from "../ToolTarget";

function ElementBase({element, isSelected, tool, grid, optionsForm, actions, children}) {
    const { placementStyles } = useElementPlacement(element,grid);

    const modal = useModal();


    function handleChange(element) {
        actions.saveElement(element);
    }

    const handlePointerDown = event => {
        actions.selectElement(element, event.ctrlKey);
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

    return <ToolTarget tool={tool} targetType="element" targetModel={element} className={`element ${useClass(isSelected, 'element--selected')}`} tabIndex={-1} data-id={element.id} style={{...placementStyles}} onDoubleClick={handleShowOptionsDialog} onPointerDown={handlePointerDown} grid={grid} onUpdate={handleChange}>
        {children}
        <div className="element__tool-buttons">
            {optionsForm && <button className="button tool-button" title="Options" onClick={handleShowOptionsDialog}><i className="fas fa-ellipsis-v fa-fw"></i></button>}
        </div>
        <div className="element__close-button">
            <button className="button tool-button" title="Remove this element." onClick={handleRemoveRequest}><i className="fas fa-times fa-fw"></i></button>
        </div>
    </ToolTarget>
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