import styled from 'styled-components';

import { Button } from 'antd';

import { getAuth, signOut } from 'firebase/auth';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import './Header.css';
import { Link } from 'react-router-dom';

const MenuArea = styled.div`
  float: right;
  margin: 5px;
`

const ClearButton = styled(Button)`
  background-color: transparent;
  border: none;
  color: var(--jet);
  font-size: 18px;
  display: inline-block;
`

function Header() {
  const user = getAuth().currentUser
  if (user === null) {
    return null
  }

  return (
    <MenuArea>
      <div style={{ marginRight: "10px", display: "inline-block" }}><h3>{user.displayName}</h3></div>
      <Link to='/settings'><SettingOutlined style={{ display: "inline-block", fontSize: "18px", color: "var(--jet)" }} /></Link>
      <ClearButton onClick={() => signOut(getAuth())} ><LogoutOutlined /></ClearButton>
    </MenuArea>
  );
}

export default Header;
