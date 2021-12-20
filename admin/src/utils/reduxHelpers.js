export function createReducer(actionMethods = [], initialState) {
    return (state = initialState, action) => {
        const actionMethod = actionMethods[action.type];

        return actionMethod ? actionMethod(state, action) : state;
    };
}