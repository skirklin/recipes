import { useMemo, useReducer } from 'react';

import { Tabs } from 'antd';

import { Tab, getTabName } from './Tabs/Tab';
import { initState, ViewerContext } from './context';
import { ViewerActionType, ViewerStateType } from './types';
import { viewerReducer } from './reducer';
import { getAllRecipesTabKey } from './Tabs/AllRecipesTab';

import './Body.css';
import styled from 'styled-components';

export const { TabPane } = Tabs;

const Container = styled.div`
  background-color: lightgrey;
`

function Body() {
    const [state, dispatch] = useReducer<React.Reducer<ViewerStateType, ViewerActionType>>(viewerReducer, initState())

    const viewerValue = useMemo(() => {
        return { state, dispatch };
    }, [state, dispatch]);

    function handleChange(e: any) {
        dispatch({ type: "SET_ACTIVE_TAB", payload: e })
    }

    function handleEdit(e: any, action: string) {
        switch (action) {
            // I haven't found a way to remove the close icon, so at least don't let the all recipes tab close.
            case "remove":
                if (e !== getAllRecipesTabKey({})) {
                    dispatch({ type: "REMOVE_TAB", payload: e })
                }
                break;

            default:
                break;
        }
    }

    let tabPanes: JSX.Element[] = []
    state.tabs.forEach((value, key) => {
        tabPanes.push(
            <TabPane key={key} tab={getTabName(value)} >
                <Tab content={value} />
            </TabPane>
        )
    })

    return (
        <ViewerContext.Provider value={viewerValue}>
            <Container>
                <div className="card-container">
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
                </div>
            </Container>
        </ViewerContext.Provider>
    );
}

export default Body;
