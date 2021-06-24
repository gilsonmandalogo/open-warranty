import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import BsNavbar from 'react-bootstrap/Navbar';
import { BsListUl, BsPlus } from 'react-icons/bs';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();

  const renderButtons = React.useMemo(() => (
    <>
      <Link to="/list">
        <Button disabled={location.pathname === "/list"} variant="outline-light" className="mr-sm-2"><BsListUl/> List</Button>
      </Link>
      <Link to="/add">
        <Button disabled={location.pathname === "/add"} variant="outline-light"><BsPlus/> Add</Button>
      </Link>
    </>
  ), [location.pathname]);

  return (
    <BsNavbar bg="dark" variant="dark" sticky="top">
      <BsNavbar.Brand>Open-Warranty</BsNavbar.Brand>
      <BsNavbar.Toggle aria-controls="navbar-main"/>
      <BsNavbar.Collapse id="navbar-main">
      <Nav className="ml-auto">
        <Form inline>
          {renderButtons}
        </Form>
      </Nav>
      </BsNavbar.Collapse>
    </BsNavbar>
  );
};
