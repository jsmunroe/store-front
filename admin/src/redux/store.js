import configureStore from "./configureStore.dev";
import initialState from "./reducers/initialState";

const store = configureStore(initialState);

export default store;