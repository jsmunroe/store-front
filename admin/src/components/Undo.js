import { connect } from "react-redux"
import { key, useKeyBindings } from "../hooks/useKeyBindings";
import * as undoActions from "../redux/actions/undoActions"

function Undo({stateName, canUndo, onUndo, canRedo, onRedo}) {
    useKeyBindings(
        key('KeyZ').withControl().if(() => canUndo).bind(onUndo),
        key('KeyY').withControl().if(() => canRedo).bind(onRedo),
    )

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