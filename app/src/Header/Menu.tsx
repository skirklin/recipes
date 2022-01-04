import styled from 'styled-components';

import { Button } from 'antd';

import { getAuth, signOut } from 'firebase/auth';
import { InboxOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Header.css';

const MenuArea = styled.div`
  float: right;
  margin: 5px;
`

function Header() {
  const user = getAuth().currentUser
  if (user === null) {
    return null
  }

  return (
    <MenuArea>
      <div style={{ marginRight: "10px", display: "inline-block" }}>{user.displayName}</div>
      <Link title="Manage boxes" className="recipes-btn" to='/boxes'><InboxOutlined className="recipes-icon" /></Link>
      <Button title="Logout" className="recipes-btn" style={{}} onClick={() => signOut(getAuth())} >
        <LogoutOutlined className="recipes-icon" />
      </Button>
    </MenuArea>
  );
}

export default Header;
