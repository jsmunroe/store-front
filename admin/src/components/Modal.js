import { useContext, useReducer } from "react";
import { createContext } from "react";
import { confirm as confirmBox } from "react-confirm-box";
import { key, useKeyBindings } from "../hooks/useKeyBindings";
import { createReducer } from "../utils/reduxHelpers";

const ModalContext = createContext();

export function Modal({content, ...state}) {
    const { onCancel } = state;

    useKeyBindings(
        key('Escape').if(() => content).bind(onCancel)
    )

    if (!content) {
        return <></>;
    }

    const ContentComponent = content;
    return <div className="modal">
        <div className="modal__backdrop" onMouseDown={onCancel}></div>
        <div className="modal__content">
            <ContentComponent {...state}/>
        </div>
    </div>
}

const modalReducerActions = {
    pushFrame: frame => ({type: 'PUSH_FRAME', frame}),
    popFrame: () => ({type: 'POP_FRAME'}),
}

const modalReducer = createReducer({
    PUSH_FRAME: (state, {frame}) => {
        return [...state, frame];
    },
    POP_FRAME: (state) => {
        return state.slice(0, -1);
    }
}, [])

export function ModalHarness({children}) {
    const [state, dispatch] = useReducer(modalReducer, []);

    const popFrame = () => dispatch(modalReducerActions.popFrame());
    const pushFrame = frame => dispatch(modalReducerActions.pushFrame(frame));

    const contextValue = {};
    contextValue.hide = () => popFrame(null);
    contextValue.show = (content, state) => {
        return new Promise((resolve, reject) => {
            const frameState = {
                ...state, 
                onSubmit: (model) => {
                    popFrame();
                    resolve(model);
                    state?.onSubmit && state.onSubmit(model);
                },
                onCancel: (model) => {
                    popFrame();
                    resolve(null);
                    state?.onCancel && state.onCancel(model);
                }
            }

            pushFrame({...frameState, content})
        })
    }

    return <ModalContext.Provider value={contextValue}>
        {children}
        {state.map((frame, index) => <Modal key={index} {...frame} />)}
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
    useKeyBindings(
        key('Enter', 'NumpadEnter').bind(onConfirm),
        key('Escape').bind(onCancel),
    )

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