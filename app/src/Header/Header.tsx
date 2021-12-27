import styled from 'styled-components';

import { Button } from 'antd';

import { getAuth, signOut } from 'firebase/auth';
import AddBoxModal from './AddBox';
import AddRecipesModal from './AddRecipes'
import CreateBoxModal from './CreateBox'
import { LogoutOutlined } from '@ant-design/icons';

const LogoutButton = styled(Button)`
  margin: 0px 5px;
`

const SignOutArea = styled.div`
  float: right;
  padding: 5px;
  margin: 5px;
`

const Container = styled.div`
  background-color: var(--gainsboro);
  border-bottom: solid;
  padding: 10px;
`

const Title = styled.h1`
  margin: 0px;
  display: inline-block;
`

const SearchArea = styled.div`
  padding: 5px;
  margin: 5px;
  display: inline-block;
`


function Header() {
  let title = <Title>Recipe box</Title>
  return (
    <Container>
      <div>

        {title}
        <SignOutArea>
          <span>
            Welcome {getAuth().currentUser?.displayName}
            <LogoutButton icon={<LogoutOutlined />} onClick={() => signOut(getAuth())}>Logout</LogoutButton>
          </span>
        </SignOutArea>
      </div>
      <div>
        <SearchArea>
          <label>Search: </label>
          <input type="text" onChange={e => console.log(e)} />
        </SearchArea>

        <AddRecipesModal />
        <AddBoxModal />
        <CreateBoxModal />
      </div>
    </Container >
  );
}

export default Header;
