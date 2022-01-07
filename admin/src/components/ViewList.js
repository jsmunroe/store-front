import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as viewActions from "../redux/actions/viewActions";
import useNavigate from "../hooks/useNavigate";
import './ViewList.scss'
import { useDialog } from "./Dialog";
import CreateViewForm from "./CreateViewForm";

function ViewList({views, actions}) {
    const dialog = useDialog();
    const navigate = useNavigate();

    const handleViewItemClick = view => {
        actions.loadView(view);
        navigate.toViewEditor();
    }

    const handleCreateViewClick = async event => {
        const view = await dialog.show(props => <CreateViewForm views={views} {...props} />);

        if (view) {
            actions.saveView(view);
            actions.loadView(view);
            navigate.toViewEditor();
        }
    }

    return <div className="view-list">
        {views.map(v => <button key={v.id} className="view-item" onClick={() => handleViewItemClick(v)}>
            <i className="fas fa-grip-horizontal view-item__icon"></i>
            <span className="view-item__name">{v.name}</span>
        </button>)}

        <button className="view-list__create-view" onClick={handleCreateViewClick} title="New View">
            <i className="fas fa-plus view-list__create-view-icon"></i>
        </button>
    </div>
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