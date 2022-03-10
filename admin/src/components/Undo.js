import { useEffect } from "react";
import { connect } from "react-redux"
import * as undoActions from "../redux/actions/undoActions"
import { bindKeyEvents, stop } from "../utils/domHelpers";

function Undo({stateName, canUndo, onUndo, canRedo, onRedo}) {
    useEffect(() => {
        return bindKeyEvents(event => {
            if (canUndo && event.ctrlKey && event.code === 'KeyZ') {
                stop(event);
                onUndo();
            }
    
            if (canRedo && event.ctrlKey && event.code === 'KeyY') {
                stop(event);
                onRedo();
            }
        });
    }, [canUndo, onUndo, canRedo, onRedo])

    return <>
        <button className="tool-bar__button" disabled={!canUndo} onClick={onUndo}><i className="fas fa-undo-alt"></i></button>
        <button className="tool-bar__button" disabled={!canRedo} onClick={onRedo}><i className="fas fa-redo"></i></button>
    </>
}

function mapStateToProps(state, ownProps) {
    const {stateName} = ownProps;
    return {
        canUndo: state[stateName].past.length > 0,
        canRedo: state[stateName].future.length > 0,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onUndo: () => dispatch(undoActions.undo()),
        onRedo: () => dispatch(undoActions.redo()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Undo);