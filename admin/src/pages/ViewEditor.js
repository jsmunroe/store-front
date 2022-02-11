import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Section from "../components/Section"
import ResizeTool from "../components/tools/ResizeTool"
import * as viewActions from "../redux/actions/viewActions"
import initialSections from "../config/initialSections.json"
import './ViewEditor.scss'
import { useParams } from "react-router-dom"
import RadioButton from "../components/controls/RadioButton"
import { toValue } from "../utils/htmlHelpers"
import createTool from "../components/tools/createTool"

function ViewEditor({view, viewsLoaded, actions}) {
    const [selectedTool, setSelectedTool] = useState(new ResizeTool())
    const { id } = useParams();

    useEffect(() => {
        if (viewsLoaded) {
            actions.loadViewById(id);
        }
    }, [id, viewsLoaded])

    const handleSectionUpdate = section => {  
             
        actions.saveView(view);
    }

    const handleSelectTool = value => {
        setSelectedTool(createTool(value));
    }

    return <div className="view-editor">
        <div className="tool-bar">
            <RadioButton className="tool-bar__button" name="tool" value="resize" title="Text" checked={selectedTool.key === 'resize'} onChange={toValue(handleSelectTool)}><i className="fas fa-expand-arrows-alt fa-fw"></i></RadioButton>
            <RadioButton className="tool-bar__button" name="tool" value="insert-text" title="Text" checked={selectedTool.key === 'insert-text'} onChange={toValue(handleSelectTool)}><i className="fas fa-font fa-fw"></i></RadioButton>
            <RadioButton className="tool-bar__button" name="tool" value="insert-image" title="Image" checked={selectedTool.key === 'insert-image'} onChange={toValue(handleSelectTool)}><i className="far fa-image fa-fw"></i></RadioButton>
        </div>
        <div className="view-editor__page">
            {view?.sections?.map((section, index) => <Section key={index} tool={selectedTool} onUpdateSection={handleSectionUpdate} section={section} />)}
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