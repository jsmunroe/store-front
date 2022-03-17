import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import useElementPlacement from "../../hooks/useElementPlacement"
import useCatalog from "../../hooks/useCatalog";
import { useModal } from "../Modal";
import { classIf } from "../../utils/htmlHelpers";
import * as viewEditorActions from '../../redux/actions/viewEditorActions'
import ToolTarget from "../ToolTarget";
import ElementOptionsForm from '../options/ElementOptionsForm'
import ElementContent from "./ElementContent";

function Element({element, isSelected, tool, grid, actions}) {
    const { placementStyles } = useElementPlacement(element,grid);

    const modal = useModal();

    const catalog = useCatalog('element-refs');

    function handleChange(element) {
        actions.saveElement(element);
    }

    const handlePointerDown = event => {
        actions.selectElements([element], event.ctrlKey);
    }

    const handleShowOptionsDialog = async event => {
        const elementOptions = await modal.show(ElementOptionsForm, { element });

        if (elementOptions) {
            handleChange({...element, ...elementOptions});
        }
    }

    const handleRemoveRequest = event => {
        actions.removeElements([element]);
    }

    const handleSetRef = domElement => {
        catalog.setValue(element.id, domElement);
    }

    return <ToolTarget tool={tool} targetType="element" targetModel={element} className={`element ${classIf(isSelected, 'element--selected')}`} tabIndex={-1} data-id={element.id} onSetRef={handleSetRef} style={{...placementStyles}} onDoubleClick={handleShowOptionsDialog} onPointerDown={handlePointerDown} grid={grid} onUpdate={handleChange}>
        <ElementContent element={element} />
        <div className="element__tool-buttons">
            <button className="button tool-button" title="Options" onClick={handleShowOptionsDialog}><i className="fas fa-ellipsis-v fa-fw"></i></button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Element);