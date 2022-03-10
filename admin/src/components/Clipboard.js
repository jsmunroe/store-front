import { useEffect } from "react";

function bindKeyEvents(canCopy, copy, canPaste, paste) {
    const onKeyDown = event => {
        if (canCopy && event.ctrlKey && event.code === 'KeyC') {
            copy();
        }

        if (canPaste && event.ctrlKey && event.code === 'KeyV') {
            paste();
        }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => { 
        document.removeEventListener('keydown', onKeyDown);
    }
}

export default function Clipboard({canCopy, onCopy, canPaste, onPaste}) {
    useEffect(() => {

        return bindKeyEvents(canCopy, onCopy, canPaste, onPaste);

    }, [canCopy, onCopy, canPaste, onPaste])

    return <>
        <button className="tool-bar__button" title="Copy" disabled={!canCopy} onMouseDown={onCopy}><i className="fas fa-copy fa-fw"></i></button>
        <button className="tool-bar__button" title="Paste" disabled={!canPaste} onMouseDown={onPaste}><i className="fas fa-paste fa-fw"></i></button>
    </>
}
