import styled from 'styled-components';

import { Button, Switch } from 'antd';

import { getAuth, signOut } from 'firebase/auth';
import AddBoxModal from './AddBox';
import AddRecipesModal from './AddRecipes'
import CreateBoxModal from './CreateBox'
import { LogoutOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { Context } from '../context';
import './Header.css';

const LogoutButton = styled(Button)`
  margin: 0px 5px;
`

const SignOutArea = styled.div`
  float: right;
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

  let title = <Title>Recipe box</Title>
  return (
    <Container>
      <div>
        {title}
        <SignOutArea>
          <Switch
            className={writeable ? 'readonly-switch-writeable' : 'readonly-switch-readonly'}
            style={{ margin: "7px" }}
            onChange={e => dispatch({ type: "SET_READONLY", payload: e })}
            checkedChildren="Edit-mode"
            unCheckedChildren="Read-only"
          />
          <span>
            Welcome {getAuth().currentUser?.displayName}
            <LogoutButton icon={<LogoutOutlined />} onClick={() => signOut(getAuth())}>Logout</LogoutButton>
          </span>
        </SignOutArea>
      </div>
      <AddRecipesModal />
      <AddBoxModal />
      <CreateBoxModal />
    </Container >
  );
}

export default Header;
