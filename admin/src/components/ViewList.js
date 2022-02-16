import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as viewActions from "../redux/actions/viewActions";
import useNavigate from "../hooks/useNavigate";
import './ViewList.scss'
import { useModal } from "./Modal";
import CreateViewForm from "./CreateViewForm";

function ViewList({views, actions}) {
    const modal = useModal();
    const navigate = useNavigate();

    const handleViewItemClick = view => {
        actions.loadView(view);
        navigate.toViewEditor(view.id);
    }

    const handleCreateViewClick = async event => {
        const view = await modal.show(CreateViewForm, {views});

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