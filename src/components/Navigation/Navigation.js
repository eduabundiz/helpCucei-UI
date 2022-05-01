import React, {useEffect, useState} from 'react'
import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import {BrowserRouter as Router, Route, Routes, Navigate, Link} from "react-router-dom";
import {UserOutlined} from '@ant-design/icons';
import Login from '../Login/Login';
import lb from '../../assets/lightbulb.png'
import Axios from 'axios';
import { SERVICES_URL } from '../../utils/constants';

export default function Navigation({token}) {
  const [user, setUser] = useState({});

  async function getUser(){
    try{
      await Axios.get(SERVICES_URL+'/api/getuser',{
        params: {correo: token}
      }
      ).then((response) => {
        setUser(response.data[0]);
    });
    }catch{
      console.log("ERROR GETTING USER")
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  function logOut(){
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload(true);
  }

  return (
    <Navbar collapseOnSelect expand="lg" variant="light" className='navigation'>
      <Container>
      <Navbar.Brand>
        <img style={{width:"1rem", marginRight:"1rem"}} src={lb}/>
        <Link className='navigationLinkBrand' to="/home">HelpCUCEI</Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link>
            <Link className='navigationBlog' to="/blog">BLOG</Link>
          </Nav.Link>
          <Nav.Link>
            <Link className='navigationBlog' style={{marginRight:"3rem"}} to="/news">NOTICIAS</Link>
          </Nav.Link>
          <NavDropdown title="SUPERVISOR" id="collasible-nav-dropdown" hidden={(user.rol >= 'Supervisor') ? false : true}>
            <NavDropdown.Item>
              <Link className='navigationBlogDropDown' to="/checkposts">REVISAR POSTS</Link>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <Link className='navigationBlogDropDown' to="/checknews">REVISAR NOTICIAS</Link>
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <Nav.Link>
            <Link className='navigationBlog' style={{marginRight:"3rem"}} to="/profile"><UserOutlined/> Perfil</Link>
          </Nav.Link>
          <Nav.Link href="/">
            <Button variant="primary" style={{margin:"0"}} className='FormButtonSalir' onClick={() => logOut()}>
              CERRAR SESIÓN
            </Button>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
