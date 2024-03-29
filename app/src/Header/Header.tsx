import styled from 'styled-components';

import './Header.css';
import Breadcrumbs from './Breadcrumbs';
import Menu from './Menu'

const Container = styled.div`
  background-color: var(--mint-cream);
  padding: 5px;
  display: flex;
  border-bottom: black;
  border-bottom-style: solid;
  border-bottom-width: thin;
`

function Header() {
  return (
    <Container>
      <Breadcrumbs />
      <Menu />
    </Container >
  );
}

export default Header;
