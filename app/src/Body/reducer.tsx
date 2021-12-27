import _ from 'lodash';
import { getKey } from './Tabs/Tab';
import { ViewerStateType, ViewerActionType } from './types';

export function viewerReducer(state: ViewerStateType, action: ViewerActionType): ViewerStateType {
    console.log("viewerReducer action:", action)
    switch (action.type) {
        case 'APPEND_TAB':
            let key = getKey(action.payload)!
            let tabs = new Map([...state.tabs, [key, action.payload]])
            return { ...state, tabs, activeTab: key }
        case 'REMOVE_TAB': {
            let { activeTab } = state;
            let key = action.payload as string
            let tabs = new Map(state.tabs)
            if (key === activeTab) {
                let tabIdx = _.indexOf([...state.tabs.keys()], key)
                activeTab = [...state.tabs.keys()][tabIdx-1]
            }
            tabs.delete(action.payload as string)
            return {
                ...state,
                activeTab,
                tabs,
            }
        }
        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.payload.toString() }
    }
    return { ...state }
}