import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import View from "../components/View"
import * as viewActions from "../redux/actions/viewActions"
import * as viewEditorActions from "../redux/actions/viewEditorActions"
import { useParams } from "react-router-dom"
import { toIsChecked, toValue } from "../utils/htmlHelpers"
import createToolFactory from "../tools/createToolFactory"
import RadioButton from "../components/controls/RadioButton"
import Checkbox from "../components/controls/Checkbox"
import Undo from "../components/Undo"
import Clipboard from "../components/Clipboard"
import useSetting from "../hooks/useSetting"
import { key, useKeyBindings } from "../hooks/useKeyBindings"
import './ViewEditor.scss'

function ViewEditor({view, viewsLoaded, viewEditor, actions}) {
    const [toolFactory, setToolFactory] = useState(createToolFactory(null))
    const [showGrid, setShowGrid] = useSetting('ViewEditor.ShowGrid', true);
    const { id } = useParams();

    useEffect(() => {
        if (viewsLoaded) {
            actions.loadViewById(id);
        }
    }, [id, viewsLoaded, actions])

    useKeyBindings(
        key('Delete').bind(event => handleDeleteElements(event)),
    )

    const handleViewUpdate = view => {  
        actions.saveView(view);

        // Change tool back to default tool
        setToolFactory(createToolFactory(null));
    }

    const handleSelectTool = value => {
        setToolFactory(createToolFactory(value));
    }

    const handleShowGrid = value => {
        setShowGrid(value);
    }

    const handleDeleteElements = (event) => {
        if (viewEditor.selectedElements.length) {
            actions.removeElements(viewEditor.selectedElements);
        }
    }

    const handleSelectionDropDownClick = (event) => {
        actions.clearSelectedElements();
    }

    return <div className="view-editor">
        {!!viewEditor.selectedElements.length && <div className="view-editor__selection-backdrop" onClick={handleSelectionDropDownClick}></div>}
        <div className="view-editor__page">
            <View toolFactory={toolFactory} onUpdate={handleViewUpdate} view={view} showGrid={showGrid} />
        </div>
        <div className="tool-bar">
            <RadioButton className="tool-bar__button" name="tool" value="resize" title="Resize" checked={toolFactory.key === 'resize'} onChange={toValue(handleSelectTool)}><i className="icon-resize"></i></RadioButton>
            <RadioButton className="tool-bar__button" name="tool" value="insert-text" title="Text" checked={toolFactory.key === 'insert-text'} onChange={toValue(handleSelectTool)}><i className="icon-insert-text"></i></RadioButton>
            <RadioButton className="tool-bar__button" name="tool" value="insert-image" title="Image" checked={toolFactory.key === 'insert-image'} onChange={toValue(handleSelectTool)}><i className="icon-insert-image"></i></RadioButton>
            <div className="tool-bar__spacer"></div>
            <Checkbox className="tool-bar__button" name="showGrid" title="Show Grid" checked={showGrid} onChange={toIsChecked(handleShowGrid)}><i className="icon-grid"></i></Checkbox>
            <div className="tool-bar__spacer"></div>
            <Undo stateName="view" />
            <div className="tool-bar__spacer"></div>
            <Clipboard />
        </div>
    </div>
}

function mapStateToProps({view, views, viewEditor}, ownProps) {
    return {
        view: view.present, 
        viewsLoaded: views.loaded,
        viewEditor,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {...bindActionCreators(viewActions, dispatch),
                  ...bindActionCreators(viewEditorActions, dispatch)}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewEditor);