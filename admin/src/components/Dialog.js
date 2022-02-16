import React, { useContext, useEffect, useRef, useState } from "react";
import { useClass } from "../utils/htmlHelpers";
import './Dialog.scss';


export function useDialogState(isShown = false) {
    const [dialogState] = useState(new DialogState(isShown));
    return dialogState
}

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

    return <div className={`dialog ${useClass(isShown, 'open')}`} ref={dialogRef}>
        <div className="dialog__backdrop" onMouseDown={handleBackdropMouseDown}></div>
        <div className="dialog__content">
            {children}
        </div>
    </div>
}

const DialogContext = React.createContext();

export function MobileHarness({children}) {
    const [component, setComponent] = useState(<></>);
    const dialogState = useDialogState();

    const handleSubmit = model => {
        dialogState.complete(model);
    }    

    const handleCancel = () => {
        dialogState.cancel();
    }

    const contextValue = {
        show: (onShow) => {
            setComponent(onShow({
                onSubmit: handleSubmit,
                onCancel: handleCancel,
            }));
            return dialogState.show();
        }
    }

    return <DialogContext.Provider value={contextValue}>
        {children}
        <Dialog dialogState={dialogState}>
            {component}
        </Dialog>
    </DialogContext.Provider>
}

export function useDialog() {
    const context = useContext(DialogContext);

    if (!context) {
        throw new Error("useDialog can only be called from a component within the MobileHarness element.")
    }

    return context;
}

export const formAsDialog = (Component, dialogState) => (props) => {
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
        this._isShownChangedHandler = () => {};
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
        this._isShownChangedHandler = handler;
    }

    _raiseIsShownChanged(value) {
        this._isShownChangedHandler(value);
    }
}
