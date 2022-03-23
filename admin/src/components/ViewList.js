import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import useNavigate from "../hooks/useNavigate";
import { useModal, confirm } from "./Modal";
import * as viewActions from "../redux/actions/viewActions";
import { callWith, classIf } from "../utils/htmlHelpers";
import './ViewList.scss'

import ViewOptionsForm from "./ViewOptionsForm";

function ViewList({views, view, actions}) {
    const modal = useModal();
    const navigate = useNavigate();

    const handleViewItemClick = view => {
        actions.loadView(view);
        navigate.toViewEditor(view.id);
    }

    const handleCreateViewClick = async event => {
        const view = await modal.show(ViewOptionsForm, {});

        if (view) {
            actions.saveView(view);
            actions.loadView(view);
            navigate.toViewEditor();
        }
    }

    const handleEditView = async (event, view) => {
        view = await modal.show(ViewOptionsForm, {view, isEdit: true});

        if (view) {
            actions.saveView(view);
        }
    }

    const handleRemoveView = async (event, view) => {
        if (await confirm(`Are you sure you want to remove ${view.name}?`)) {
            actions.removeView(view);
        }
    }

    return <div className="view-list">
        {views.map(v => <div key={v.id} className={`view-item ${classIf(v.id === view?.id, 'view-item--selected')}`} onClick={() => handleViewItemClick(v)}>
            <i className="icon-view view-item__icon"></i>
            <span className="view-item__name">{v.name}</span>
            <div className="view-item__tool-buttons">
                <button className="view-item__tool-button" title="Edit view" onClick={callWith(handleEditView, v)}><i className="fas fa-ellipsis-v fa-fw"></i></button>
                <button className="view-item__tool-button" title="Remove view" onClick={callWith(handleRemoveView, v)}><i className="fas fa-times fa-fw"></i></button>
            </div>
        </div>)}

        <button className="view-list__create-view" onClick={handleCreateViewClick} title="New View">
            <i className="icon-new-view view-list__create-view__icon"></i>
        </button>
    </div>
}


function mapStateToProps({views, view}, ownProps) {
    return {
        views: views.loaded ? views.all : [],
        view: view.present,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(viewActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewList);