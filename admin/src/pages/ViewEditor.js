import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Section from "../components/Section"
import * as viewActions from "../redux/actions/viewActions"
import './ViewEditor.scss'

function ViewEditor({view}) {
    const sections = [
        {
            columns: 12,
            rows: 7,
            elements: [
                {
                    type: 'Image',
                    src: 'https://dummyimage.com/600x400/fff/BBB.png',
                    width: 3,
                    height: 3,
                },
                {
                    type: 'Image',
                    src: 'https://dummyimage.com/800x600/fff/BBB.png',
                    left: 3,
                    width: 3,
                    height: 3,
                },
            ]
        }
    ]    
    return <div className="view-editor">
        <div className="view-editor__page">
            {sections.map((section, index) => <Section key={index} section={section} />)}
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