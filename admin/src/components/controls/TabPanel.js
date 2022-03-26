import { createContext, useContext, useEffect, useReducer} from "react"
import useFieldState from "../../hooks/useFormState";
import { callWith, classIf } from "../../utils/htmlHelpers";
import { createReducer } from "../../utils/reduxHelpers";

export function TabPanel({name, title, selectedTabName: selectedTabNameProp, children}) {
    const [value, setValue] = useFieldState(name);
    const tabPanelState = useTabPanelState(selectedTabNameProp ?? value);

    const handleTabClick = (event, tabName) => {
        tabPanelState.selectTab(tabName);
        setValue(tabName);
    }

    return <TabPanelContext.Provider value={tabPanelState}>
        <>
            <div className="tab-list">
                {title && <span className="tab-list__title">{title}</span> }
                {tabPanelState.getTabs().map(tab => 
                    <button type="button" className={`tab-list__button ${classIf(tabPanelState.isTabSelected(tab.name), 'selected')}`} key={tab.name} onClick={callWith(handleTabClick, tab.name)}>{tab.title}</button>    
                )}
            </div>
            
            {children}

        </>
    </TabPanelContext.Provider>
}

export function TabItem({name, title, children}) {
    const {isSelected} = useTabItemState(name, title);

    if (!isSelected) {
        return <></>
    }

    return <>{children}</>;
}

const initialState = {
    tabs: [],
    selectedTabName: '',
}

const actionTypes = {
    addTab: 'ADD_TAB',
    selectTab: 'SELECT_TAB',
}

const TabPanelContext = createContext();

const tabPanelReducer = createReducer({
    [actionTypes.addTab]: (state, {tab}) => {
        let {tabs, selectedTabName} = state;

        let existingTab = tabs.find(t => t.name === tab.name);
        if (tab === existingTab && selectedTabName) {
            return state;
        }

        if (!selectedTabName) {
            selectedTabName = tab.name;
        }

        if (existingTab) {
            tabs = tabs.map(t => t.name === tab.name);
        }
        else {
            tabs = [...tabs, tab];
        }

        return {...state, tabs, selectedTabName};
    },

    [actionTypes.selectTab]: (state, {tabName}) => {
        let {selectedTabName} = state;

        if (selectedTabName === tabName || typeof tabName === 'undefined') {
            return state;
        }

        selectedTabName = tabName;

        return {...state, selectedTabName};
    },
});


class tabPanelState {
    constructor(state, dispatch) {
        this.state = state;
        this.dispatch = dispatch;
    }

    addTab(name, title) {
        const tab = {name, title}
        this.dispatch({type: actionTypes.addTab, tab});
    }

    selectTab(tabName) {
        this.dispatch({type: actionTypes.selectTab, tabName});
    }

    getSelectedTabName() {
        return this.state.selectedTabName;
    }

    getTabs() {
        return [...this.state.tabs.map(t => ({...t}))];
    }

    isTabSelected(tabName) {
        return tabName === this.state.selectedTabName;
    }
}

function useTabPanelState(selectedTabName) {
    const [state, dispatch] = useReducer(tabPanelReducer, initialState);

    useEffect(() => {
        dispatch({type: actionTypes.selectTab, tabName: selectedTabName});
    }, [selectedTabName])

    return new tabPanelState(state, dispatch);
}

function useTabItemState(name, title) {
    const tabPanelState = useContext(TabPanelContext);

    useEffect(() => {
        tabPanelState.addTab(name, title);
    }, [name, title])

    const isSelected = tabPanelState.getSelectedTabName() === name;
    const select = () => tabPanelState.selectTab(name);

    return {
        isSelected,
        select,
    };
}