import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import {BrowserRouter as Router, Route, Routes, Navigate, Link} from "react-router-dom";
import Login from '../Login/Login';
import lb from '../../assets/lightbulb.png'

export default function Navigation() {
  return (
    <Navbar collapseOnSelect expand="lg" className='navigation' variant="dark">
      <Container>
      <Navbar.Brand>
        <img style={{width:"1rem", marginRight:"1rem"}} src={lb}/>
        <Link className='navigationLinkBrand' to="/home">HelpCUCEI</Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Link className='navigationLink' to="/home">Inicio</Link>
        </Nav>
        <Nav>
          <Link className='navigationLink' to="/login">INGRESAR</Link>
        </Nav>
      </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
