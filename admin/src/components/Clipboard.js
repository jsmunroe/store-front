import { connect } from "react-redux";
import { copyElements, hasElements, pasteElements } from "../utils/clipboard"
import * as viewEditorActions from '../redux/actions/viewEditorActions'
import { bindActionCreators } from "redux";
import { key, useKeyBindings } from "../hooks/useKeyBindings";
import { useInterval } from "../hooks/useInterval";
import { useState } from "react";

function Clipboard({selectedElements, canCopy, actions}) {
    const [canPaste, setCanPaste] = useState(false);

    const handleCopy = async event =>  {
        event.preventDefault();
        event.stopPropagation();
        
        await copyElements(selectedElements);
        setCanPaste(await hasElements());
    };

    const handlePaste = async event => {
        event.preventDefault();
        event.stopPropagation();

        const elements = await pasteElements()
        elements && actions.addElements(elements);
    };
    
    useKeyBindings(
        key('KeyC').withControl().if(() => canCopy).bind(() => handleCopy()),
        key('KeyV').withControl().if(() => canPaste).bind(() => handlePaste())
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

export default connect(mapStateToProps, mapDispatchToProps)(Clipboard);
