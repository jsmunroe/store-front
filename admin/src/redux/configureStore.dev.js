import { applyMiddleware, createStore } from "redux";
import rootReducer from "./reducers";
import reduxImmutableStateInvarient from "redux-immutable-state-invariant"
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';
import dispatchMiddleware from "./dispatchMiddleware";

export default function configureStore(initialState) {
    const composeEnhancers = composeWithDevTools({ trace: true })
    //const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // Add support for Redux dev tools.
    return createStore(
        rootReducer, 
        initialState, 
        composeEnhancers(
            applyMiddleware(
                thunk,
                dispatchMiddleware,
                reduxImmutableStateInvarient() // Warns if state is mutated within a repository.
            ),
        ),
    );
}


