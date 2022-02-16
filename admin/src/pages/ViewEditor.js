import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Section from "../components/Section"
import * as viewActions from "../redux/actions/viewActions"
import { useParams } from "react-router-dom"
import { toValue } from "../utils/htmlHelpers"
import createToolFactory from "../components/tools/createToolFactory"
import './ViewEditor.scss'
import RadioButton from "../components/controls/RadioButton"
import { saveElementOnProperty } from "../utils/mutate"


function ViewEditor({view, viewsLoaded, actions}) {
    const [toolFactory, setToolFactory] = useState(createToolFactory(null))
    const [optionsState, setOptionsState] = useState(null);
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

    return <div className="view-editor">
        <div className="tool-bar">
            <RadioButton className="tool-bar__button" name="tool" value="resize" title="Text" checked={toolFactory.key === 'resize'} onChange={toValue(handleSelectTool)}><i className="fas fa-expand-arrows-alt fa-fw"></i></RadioButton>
            <RadioButton className="tool-bar__button" name="tool" value="insert-text" title="Text" checked={toolFactory.key === 'insert-text'} onChange={toValue(handleSelectTool)}><i className="fas fa-font fa-fw"></i></RadioButton>
            <RadioButton className="tool-bar__button" name="tool" value="insert-image" title="Image" checked={toolFactory.key === 'insert-image'} onChange={toValue(handleSelectTool)}><i className="far fa-image fa-fw"></i></RadioButton>
        </div>
        <div className="view-editor__page">
            {view?.sections?.map((section, index) => <Section key={index} toolFactory={toolFactory} onUpdateSection={handleSectionUpdate} section={section} />)}
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