import styled from 'styled-components';

import { Button } from 'antd';

import { getAuth, signOut } from 'firebase/auth';
import { InboxOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const MenuArea = styled.div`
  margin: 5px;
  margin-left: auto;
  font-size: 16px;
`

const StyledButton = styled(Button)`
  background-color: transparent;
  color: var(--jet);
  border: none;
  &:hover {
    color: var(--selective-yellow);
    background-color: transparent;
  }
  &:focus {
    color: var(--selective-yellow);
    background-color: transparent;
  }
`


function Header() {
  const navigate = useNavigate()
  const user = getAuth().currentUser
  if (user === null) {
    return null
  }

  return (
    <MenuArea>
      <div style={{ marginRight: "10px", display: "inline-block" }}>{user.displayName}</div>
      <StyledButton title="Manage boxes" onClick={() => navigate('/boxes')} icon={<InboxOutlined /> } />
      <StyledButton title="Logout" style={{}} onClick={() => signOut(getAuth())} icon={<LogoutOutlined />} className="recipes-icon" />
    </MenuArea>
  );
}

export default Header;
