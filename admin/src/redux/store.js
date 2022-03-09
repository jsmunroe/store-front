import configureStore from "./configureStore.dev";

const store = configureStore({});
export default store;

export const dispatch = action => store.dispatch(action);
export const getState = () => store.getState();