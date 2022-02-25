import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Section from "../components/Section"
import * as viewActions from "../redux/actions/viewActions"
import { useParams } from "react-router-dom"
import { toIsChecked, toNameIsChecked, toValue } from "../utils/htmlHelpers"
import createToolFactory from "../tools/createToolFactory"
import './ViewEditor.scss'
import RadioButton from "../components/controls/RadioButton"
import { saveElementOnProperty } from "../utils/mutate"
import Checkbox from "../components/controls/Checkbox"
import useSetting from "../hooks/useSetting"


function ViewEditor({view, viewsLoaded, actions}) {
    const [toolFactory, setToolFactory] = useState(createToolFactory(null))
    const [showGrid, setShowGrid] = useSetting('ViewEditor.ShowGrid', true);
    const { id } = useParams();

    useEffect(() => {
        if (viewsLoaded) {
            actions.loadViewById(id);
        }
    }, [id, viewsLoaded, actions])

    const handleSectionUpdate = section => {  
        view = saveElementOnProperty(view, 'sections', section);
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

    return <div className="view-editor">
        <div className="tool-bar">
            <RadioButton className="tool-bar__button" name="tool" value="resize" title="Text" checked={toolFactory.key === 'resize'} onChange={toValue(handleSelectTool)}><i className="fas fa-expand-arrows-alt fa-fw"></i></RadioButton>
            <RadioButton className="tool-bar__button" name="tool" value="insert-text" title="Text" checked={toolFactory.key === 'insert-text'} onChange={toValue(handleSelectTool)}><i className="fas fa-font fa-fw"></i></RadioButton>
            <RadioButton className="tool-bar__button" name="tool" value="insert-image" title="Image" checked={toolFactory.key === 'insert-image'} onChange={toValue(handleSelectTool)}><i className="far fa-image fa-fw"></i></RadioButton>
            <div className="tool-bar__spacer"></div>
            <Checkbox className="tool-bar__button" name="showGrid" title="Show Grid" checked={showGrid} onChange={toIsChecked(handleShowGrid)}><i className="fas fa-border-all fa-fw"></i></Checkbox>
        </div>
        <div className="view-editor__page">
            {view?.sections?.map((section, index) => <Section key={index} toolFactory={toolFactory} onUpdateSection={handleSectionUpdate} section={section} showGrid={showGrid} />)}
        </div>
    </div>
}

function mapStateToProps({view, views}, ownProps) {
    return {
        view, 
        viewsLoaded: !!views?.length
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(viewActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewEditor);