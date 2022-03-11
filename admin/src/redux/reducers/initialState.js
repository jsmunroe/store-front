const initialState = {
    user: { state: 'Unknown' },
    views: { 
        loaded: false,
        all: [],
    },
    view: {},
    viewEditor: {
        view: {},
        selectedElements: [],
    },
}

export default initialState;