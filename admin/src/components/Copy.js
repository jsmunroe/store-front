import { connect } from "react-redux";
import { copyElements, hasElements, pasteElements } from "../utils/clipboard"
import * as viewEditorActions from '../redux/actions/viewEditorActions'
import { bindActionCreators } from "redux";
import { key, useKeyBindings } from "../hooks/useKeyBindings";
import { useInterval } from "../hooks/useInterval";
import { useState } from "react";

function Copy({selectedElements, canCopy, onCopy, onCut, onPaste, actions}) {
    const [canPaste, setCanPaste] = useState(false);

    const handleCopy = async event =>  {
        await copyElements(selectedElements);
        setCanPaste(await hasElements());
        onCopy && onCopy(selectedElements);
    };

    const handleCut = async event => {
        await handleCopy(event);
        actions.removeElements(selectedElements);
        onCut && onCut(selectedElements);
    }

    const handlePaste = async event => {
        const elements = await pasteElements()
        elements && actions.addElements(elements);
        onPaste && onPaste(elements);
    };
    
    const checkCanCopy = () => {
        return canCopy && document.getSelection().type !== 'Range';
    }

    useKeyBindings(
        key('KeyC').withControl().if(checkCanCopy).bind(() => handleCopy()),
        key('KeyX').withControl().if(checkCanCopy).bind(() => handleCut()),
        key('KeyV').withControl().if(() => canPaste).bind(() => handlePaste()),
    )

    useInterval(async () => {
        try {
            setCanPaste(await hasElements());
        }
        catch(error) {
            if (error.message !== 'Document is not focused.') {
                throw error;
            }
        }
    }, 5000)

    return <>
        <button className="tool-bar__button" title="Copy" disabled={!canCopy} onMouseDown={handleCopy}><i className="fas fa-copy fa-fw"></i></button>
        <button className="tool-bar__button" title="Paste" disabled={!canPaste} onMouseDown={handlePaste}><i className="fas fa-paste fa-fw"></i></button>
        <button className="tool-bar__button" title="Cut" disabled={!canCopy} onMouseDown={handleCut}><i className="fas fa-cut fa-fw"></i></button>
    </>
}

function mapStateToProps({viewEditor}, element) {
    return {
        selectedElements: viewEditor.selectedElements,
        canCopy: viewEditor.selectedElements.length > 0,
        canPaste: true
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(viewEditorActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Copy);
