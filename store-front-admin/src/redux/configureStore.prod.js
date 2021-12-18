import { applyMiddleware, compose, createStore } from "redux";
import rootReducer from "./reducers";
import thunk from 'redux-thunk'

export default function configureStore(initialState) {
    return createStore(
        rootReducer, 
        initialState, 
        compose(
            applyMiddleware(thunk)
        ),
    );
}


