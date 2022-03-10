import { useEffect } from "react";
import { bindKeyEvents, stop } from "../utils/domHelpers";

export default function Clipboard({canCopy, onCopy, canPaste, onPaste}) {
    useEffect(() => {
        return bindKeyEvents(event => {
            if (canCopy && event.ctrlKey && event.code === 'KeyC') {
                stop(event);
                onCopy();
            }
    
            if (canPaste && event.ctrlKey && event.code === 'KeyV') {
                stop(event);
                onPaste();
            }
        });

    }, [canCopy, onCopy, canPaste, onPaste])

    return <>
        <button className="tool-bar__button" title="Copy" disabled={!canCopy} onMouseDown={onCopy}><i className="fas fa-copy fa-fw"></i></button>
        <button className="tool-bar__button" title="Paste" disabled={!canPaste} onMouseDown={onPaste}><i className="fas fa-paste fa-fw"></i></button>
    </>
}
