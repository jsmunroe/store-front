import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { confirm as confirmBox } from "react-confirm-box";

const ModalContext = createContext();

export function Modal({content, ...state}) {
    if (!content) {
        return <></>;
    }

    const ContentComponent = content;
    return <div className="modal">
        <div className="modal__backdrop"></div>
        <div className="modal__content">
            <ContentComponent {...state}/>
        </div>
    </div>
}

export function ModalHarness({children}) {
    const [modalState, setModalState] = useState(null);

    const contextValue = {};
    contextValue.hide = () => setModalState(null);
    contextValue.show = (content, state) => {
        return new Promise((resolve, reject) => {
            const thisState = {
                ...state, 
                onSubmit: (model) => {
                    setModalState(null);
                    resolve(model);
                    state.onSubmit && state.onSubmit(model);
                },
                onCancel: (model) => {
                    setModalState(null);
                    resolve(null);
                    state.onCancel && state.onCancel(model);
                }
            }

            setModalState({...thisState, content})
        })
    }

    return <ModalContext.Provider value={contextValue}>
        {children}
        <Modal {...modalState} />
    </ModalContext.Provider>
}

export function useModal() {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error("useModal can only be called from a component within the ModalHarness element.")
    }

    return context;
}

// Confirmation

export async function confirm(message) {
    return await confirmBox(message, { 
        render: (message, onConfirm, onCancel) => {
            return <Confirm message={message} onConfirm={onConfirm} onCancel={onCancel} />
        }
    });
}

function Confirm({message, onConfirm, onCancel}) {
    useEffect(() => setupKeyCommandHandler(onConfirm, onCancel), [onConfirm, onCancel]);

    return <div className="confirm">
        <div className="confirm__backdrop" onMouseDown={onCancel}></div>
        <div className="confirm__content">
            <div className="form">
                <label>{message}</label>
                <div className="form__buttons">
                    <button type="submit" className="form__submit" onClick={onConfirm}>Yes</button>
                    <button type="button" className="form__button" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    </div>;
}

function setupKeyCommandHandler(onConfirm, onCancel) {
    const handleKeyCommands = event => {
        event.preventDefault();
        event.stopPropagation();

        if (['Enter', 'NumpadEnter'].includes(event.code)) {
            onConfirm();
        }

        if (['Escape'].includes(event.code)) {
            onCancel();
        }
    }

    document.addEventListener("keydown", handleKeyCommands, false);

    return () => document.removeEventListener("keydown", handleKeyCommands, false);
}
