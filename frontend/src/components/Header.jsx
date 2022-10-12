import React from 'react';
import { Route } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const Header = () => {

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>WavePortal</Navbar.Brand>
          </LinkContainer>
           <Navbar.Collapse className="justify-content-end">
      <Navbar.Text>
        Powered by <a href="https://buildspace.so/p/build-solidity-web3-app/lessons/welcome">buildspace</a>
      </Navbar.Text>
    </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
