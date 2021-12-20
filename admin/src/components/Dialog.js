import React, { useEffect, useRef, useState } from "react";
import { useClass } from "../utils/htmlHelpers";
import './Dialog.scss';

const DialogCompleteContext = React.createContext({})

export default function Dialog({dialogState, children}) {
    const dialogRef = useRef();
    const [isShown, setIsShown] = useState(dialogState.isShown);

    useEffect(() => {
        dialogState?.onIsShownChanged(value => setIsShown(value));
        dialogState?.bind(dialogRef.current);

    }, [dialogState])

    const handleBackdropMouseDown = event => {
        dialogState.complete();
    }

    const value = {
        complete: dialogState.complete.bind(dialogState), 
        cancel: dialogState.cancel.bind(dialogState),
        isDialog: dialogState.isDialog,
    };

    return <div className={`dialog ${useClass(isShown, 'open')}`} ref={dialogRef}>
        <div className="dialog__backdrop" onMouseDown={handleBackdropMouseDown}></div>
        <div className="dialog__content">
            <DialogCompleteContext.Provider value={value}>
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

export const formAsDialog = Component => ({dialogState, ...props}) => {
    const handleSubmit = model => {
        dialogState?.complete(model);
    }    

    const handleCancel = () => {
        dialogState?.cancel();
    }

    return <Dialog dialogState={dialogState}>
        <Component onSubmit={handleSubmit} onCancel={handleCancel} {...props}/>
    </Dialog>
};

class DialogState {
    constructor(isShown = false) {
        this._isShown = isShown;
        this._isShownChangedHandlers = [];
        this._autoFocusInput = null;
    }

    get isShown() {
        return this._isShown;
    }

    bind(dialogElement) {
        if (dialogElement) {
            this._focusControl = dialogElement?.querySelector('input,textArea,select');
        }
    }

    show() {
        return new Promise(resolve => {
            this._isShown = true;
            this._resolve = resolve;
            setTimeout(() => this._focusControl?.focus(), 0);
            this._raiseIsShownChanged(true);
        })
    }

    complete(result) {
        this._isShown = false;
        this._resolve  && this._resolve(result);
        this._resolve = null;
        this._raiseIsShownChanged(false);
    }

    cancel() {
        this._isShown = false;
        this._reject  && this._resolve();
        this._resolve = null;
        this._raiseIsShownChanged(false);
    }

    onIsShownChanged(handler) {
        this._isShownChangedHandlers.push(handler);
    }

    _raiseIsShownChanged(value) {
        this._isShownChangedHandlers.forEach(h => !!h && h(value));
    }
}
