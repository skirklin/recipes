import { useState } from 'react';
import styled from 'styled-components';
import { Button, Modal } from 'antd';
// import Modal from 'react-modal';

import { PlusOutlined } from '@ant-design/icons';
import AddRecipes from './AddRecipes'

import { getAuth, signOut } from 'firebase/auth';


const SignOutButton = styled.button`
  margin: 0px 5px;
  outline: none;
`

const SignOutArea = styled.div`
  display: inline-block;
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
  margin-bottom: 20px;
  display: inline-block;
`

const StyledButton = styled(Button)`
  float: right;
  display: inline-block;
`


function Header() {
  const [visible, setIsModalVisible] = useState(false);

  let title = <Title>Recipe box</Title>
  return (
    <Container>
      {title}
      <SignOutArea>
        <span>
          Welcome {getAuth().currentUser?.displayName}
          <SignOutButton onClick={() => signOut(getAuth())}>Sign-out</SignOutButton>
        </span>
      </SignOutArea>

      <StyledButton onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>Add recipes</StyledButton>
      <label>Search: </label>
      <input type="text" onChange={e => console.log(e)} />
      <Modal visible={visible} onCancel={() => setIsModalVisible(false)} onOk={() => setIsModalVisible(false)}>
        <AddRecipes />
      </Modal>
    </Container >
  );
}

export default Header;
