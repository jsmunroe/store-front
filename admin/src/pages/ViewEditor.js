import { useState } from "react"
import { connect } from "react-redux"
import uuid from "react-uuid"
import { bindActionCreators } from "redux"
import Section from "../components/Section"
import ResizeTool from "../components/tools/ResizeTool"
import * as viewActions from "../redux/actions/viewActions"
import './ViewEditor.scss'

const initialSections = [
    {
        id: uuid(),
        columns: 12,
        rows: 12,
        elements: [
            {
                id: uuid(),
                type: 'Image',
                src: 'https://www.teabreakgardener.co.uk/wp-content/uploads/2019/05/IMG_1481.jpg',
                width: 5,
                height: 7,
            },
            {
                id: uuid(),
                type: 'Image',
                src: 'https://www.teabreakgardener.co.uk/wp-content/uploads/2021/06/IMG_1576.jpg',
                top: 2,
                left: 6,
                width: 5,
                height: 7,
            },
        ]
    }
]    

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