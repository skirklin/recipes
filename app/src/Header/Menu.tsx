import styled from 'styled-components';

import { Dropdown, Menu, Switch } from 'antd';

import { getAuth, signOut } from 'firebase/auth';
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { Context } from '../context';
import './Header.css';
import { Link } from 'react-router-dom';

const MenuArea = styled.div`
  float: right;
  margin: 5px;
`


function Header() {
  const { state, dispatch } = useContext(Context);
  const { writeable } = state;

  const menu = (<Menu>
    <Menu.Item key="0">
      <Switch
        className={writeable ? 'readonly-switch-writeable' : 'readonly-switch-readonly'}
        onChange={e => dispatch({ type: "SET_READONLY", payload: e })}
        checkedChildren="Edit-mode"
        unCheckedChildren="Read-only"
      />
    </Menu.Item>
    <Menu.Item key="2" ><Link to='/boxes'>Manage boxes</Link></Menu.Item>
    <Menu.Item key="4" onClick={() => signOut(getAuth())} ><LogoutOutlined />  Logout</Menu.Item>
  </Menu>)


  return (
    <MenuArea>
      <Dropdown overlay={menu} trigger={["click"]} >
        <MenuOutlined style={{ fontSize: "24px" }} />
      </Dropdown>
    </MenuArea>
  );
}

export default Header;
