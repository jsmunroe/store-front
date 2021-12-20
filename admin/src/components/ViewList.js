import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as viewActions from "../redux/actions/viewActions";
import useNavigate from "../hooks/useNavigate";
import './ViewList.scss'
import Dialog, { useDialogState } from "./Dialog";
import CreateViewForm from "./CreateViewForm";

function ViewList({views, actions}) {
    const createViewDialogState = useDialogState();
    const navigate = useNavigate();

    const handleCreateView = async event => {
        const view = await createViewDialogState.show();

        if (view) {
            actions.saveView(view);
            actions.loadView(view);
            navigate.toViewEditor();
        }
    }

    return <div className="view-list">
        {views.map(v => <ViewItem key={v.id} view={v} />)}

        <button className="view-list__create-view" onClick={handleCreateView}>
            <i className="fas fa-plus view-list__create-view-icon"></i>
        </button>

        <Dialog dialogState={createViewDialogState}>
            <CreateViewForm />
        </Dialog>
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