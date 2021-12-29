import { useContext, } from 'react';

import { Tabs } from 'antd';

import { Tab, getTabName } from './Tabs/Tab';
import { getContentsTabKey } from './Tabs/Contents';

import './Body.css';
import { Context } from '../context';

export const { TabPane } = Tabs;

function Body() {
    const { state, dispatch } = useContext(Context);
    function handleChange(e: any) {
        dispatch({ type: "SET_ACTIVE_TAB", payload: e })
    }

    function handleEdit(e: any, action: string) {
        switch (action) {
            case "remove":
                dispatch({ type: "REMOVE_TAB", payload: e })
                break;
            default:
                break;
        }
    }

    let tabPanes: JSX.Element[] = []
    state.tabs.forEach((value, key) => {
        tabPanes.push(
            <TabPane key={key} tab={getTabName(value)} closable={key !== getContentsTabKey({})}>
                <Tab content={value} />
            </TabPane>
        )
    })

    return (
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
    );
}

export default Body;
