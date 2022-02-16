import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import './Modal.scss';

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
