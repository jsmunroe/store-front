import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as viewActions from "../redux/actions/viewsActions";
import * as View from "../models/view";
import useNavigate from "../hooks/useNavigate";
import './ViewList.scss'

function ViewList({views, actions}) {
    const navigate = useNavigate();

    const handleCreateView = event => {
        const view = View.create();
        actions.createView(view);
        navigate.toViewEditor();
    }

    return <div className="view-list">
        {views.map(v => <ViewItem key={v.id} view={v} />)}

        <button className="view-list__create-view" onClick={handleCreateView}>
            <i className="fas fa-plus view-list__create-view-icon"></i>
        </button>
    </div>
}

function ViewItem({view}) {
    return <button className="view-item">
        <i className="fas fa-grip-horizontal view-item__icon"></i>
        <span className="view-item__name">{view.name}</span>
    </button>
}

function mapStateToProps({views}, ownProps) {
    return {
        views
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(viewActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewList);