import { useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Section from "../components/Section"
import ResizeTool from "../components/tools/ResizeTool"
import * as viewActions from "../redux/actions/viewActions"
import initialSections from "../config/initialSections.json"
import './ViewEditor.scss'

function ViewEditor({view}) {
    const [selectedTool, setSelectedTool] = useState(new ResizeTool())
    const [sections, setSections] = useState(initialSections);

    const handleSectionUpdate = section => {
        setSections(sections => sections.map(s => s.id === section.id ? section : s));
    }

    return <div className="view-editor">
        <div className="view-editor__page">
            {sections.map((section, index) => <Section key={index} tool={selectedTool} onUpdateSection={handleSectionUpdate} section={section} />)}
        </div>
    </div>
}

function mapStateToProps({view}, ownProps) {
    return {
        view
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(viewActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewEditor);