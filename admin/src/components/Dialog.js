import React, { useEffect, useState } from "react";
import { useClass } from "../utils/htmlHelpers";
import './Dialog.scss';

const DialogCompleteContext = React.createContext({})

export default function Dialog({dialogState, children}) {
    const [isShown, setIsShown] = useState(dialogState.isShown);

    useEffect(() => {
        dialogState?.onIsShownChanged(value => setIsShown(value));

    }, [dialogState])

    const handleBackdropMouseDown = event => {
        dialogState.complete();
    }

    return <div className={`dialog ${useClass(isShown, 'open')}`}>
        <div className="dialog__backdrop" onMouseDown={handleBackdropMouseDown}></div>
        <div className="dialog__content">
            <DialogCompleteContext.Provider value={{complete: dialogState.complete.bind(dialogState), isDialog: dialogState.isDialog}}>
                {children}
            </DialogCompleteContext.Provider>
        </div>
    </div>
}

export function useDialogState(isShown) {
    return new DialogState(isShown);
}

export function useDialogComplete() {
    const dialogCompleteContext = React.useContext(DialogCompleteContext);

    return !!dialogCompleteContext ? {...dialogCompleteContext, isDialog: true} : {isDialog: false};
}

class DialogState {
    constructor(isShown = false) {
        this._isShown = isShown;
        this._showChangedHandlers = [];
    }

    get isShown() {
        return this._isShown;
    }

    show() {
        return new Promise(resolve => {
            this._isShown = true;
            this._resolve = resolve;
            this._raiseIsShownChanged(true);
        })
    }

    complete(result) {
        this._isShown = false;
        this._resolve  && this._resolve(result);
        this._resolve = null;
        this._raiseIsShownChanged(false);
    }

    onIsShownChanged(handler) {
        this._showChangedHandlers.push(handler);
    }

    _raiseIsShownChanged(value) {
        this._showChangedHandlers.forEach(h => !!h && h(value));
    }
}
