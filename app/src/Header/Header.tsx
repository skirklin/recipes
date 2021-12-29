import styled from 'styled-components';

import { Button, Dropdown, Menu, Switch } from 'antd';

import { getAuth, signOut } from 'firebase/auth';
import AddBoxModal from './AddBox';
import AddRecipesModal from './AddRecipes'
import CreateBoxModal from './CreateBox'
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { Context } from '../context';
import './Header.css';

const LogoutButton = styled(Button)`
  margin: 0px 5px;
`

const MenuArea = styled.div`
  float: right;
  margin: 5px;
`

const Container = styled.div`
  background-color: var(--mint-cream);
  padding: 10px;
`

const Title = styled.h1`
  margin: 0px;
  display: inline-block;
`


function Header() {
  const { state, dispatch } = useContext(Context);
  const { writeable } = state;

  const menu = (<Menu>
    <Menu.Item key="0">
      <Switch
        className={writeable ? 'readonly-switch-writeable' : 'readonly-switch-readonly'}
        style={{ margin: "7px" }}
        onChange={e => dispatch({ type: "SET_READONLY", payload: e })}
        checkedChildren="Edit-mode"
        unCheckedChildren="Read-only"
      />
    </Menu.Item>
    <Menu.Item key="1">
      <LogoutButton icon={<LogoutOutlined />} onClick={() => signOut(getAuth())}>Logout</LogoutButton>
    </Menu.Item>
  </Menu>)


  let title = <Title>Recipe box</Title>
  return (
    <Container>
      {title}
      <MenuArea>
        <Dropdown overlay={menu} trigger={["click"]} >
          <MenuOutlined style={{ fontSize: "24px" }} />
        </Dropdown>
      </MenuArea>
      <Container>
        <AddRecipesModal />
        <AddBoxModal />
        <CreateBoxModal />
      </Container>
    </Container >
  );
}

export default Header;
