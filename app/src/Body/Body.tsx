import { useMemo, useReducer } from 'react';

import { Tabs } from 'antd';

import { Tab, getTabName } from './Tabs/Tab';
import { initState, ViewerContext } from './context';
import { ViewerActionType, ViewerStateType } from './types';
import { viewerReducer } from './reducer';

export const { TabPane } = Tabs;

function Body() {
    const [state, dispatch] = useReducer<React.Reducer<ViewerStateType, ViewerActionType>>(viewerReducer, initState())

    const viewerValue = useMemo(() => {
        return { state, dispatch };
    }, [state, dispatch]);

    function handleChange(e: any) {
        dispatch({type: "SET_ACTIVE_TAB", payload: e})
    }

    function handleEdit(e: any, action: string) {
        switch (action) {
            case "remove":
                dispatch({type: "REMOVE_TAB", payload: e})
                break;
        
            default:
                break;
        }
    }

    let tabPanes: JSX.Element[] = []
    state.tabs.forEach((value, key) => {
        tabPanes.push(
            <TabPane key={key} tab={getTabName(value)}>
                <Tab content={value} />
            </TabPane>
        )
    })

    return (
        <ViewerContext.Provider value={viewerValue}>
            <Tabs
                onChange={handleChange}
                onEdit={handleEdit}
                activeKey={state.activeTab}
                type="editable-card"
                hideAdd
                size="large"
            >
                {tabPanes}
            </Tabs>
        </ViewerContext.Provider>
    );
}

export default Body;
