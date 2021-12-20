import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import * as viewActions from "../redux/actions/viewActions"

function ViewEditor({view}) {
    return <>
        <h1>{view.name}</h1>
    </>
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