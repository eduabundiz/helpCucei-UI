import React, {useEffect, useState} from 'react'
import { Button, Container, Nav, Navbar, NavDropdown, Modal} from 'react-bootstrap'
import {BrowserRouter as Router, Route, Routes, Navigate, Link} from "react-router-dom";
import {UserOutlined} from '@ant-design/icons';
import Login from '../Login/Login';
import lb from '../../assets/lightbulb.png'
import Axios from 'axios';
import qr from '../../assets/HCCBQR.png'
import { SERVICES_URL } from '../../utils/constants';

export default function Navigation({token}) {
  const [user, setUser] = useState({});
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

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
          <NavDropdown title="SUPERVISOR" id="collasible-nav-dropdown" hidden={(user.rol === 'Supervisor' || user.rol === 'Administrador') ? false : true}>
            <NavDropdown.Item>
              <Link className='navigationBlogDropDown' to="/checkposts">REVISAR POSTS</Link>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <Link className='navigationBlogDropDown' to="/checknews">REVISAR NOTICIAS</Link>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <Link className='navigationBlogDropDown' to="/checkcomments">REVISAR COMENTARIOS</Link>
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown style={{marginLeft: "2rem"}} title="ADMINISTRADOR" id="collasible-nav-dropdown" hidden={(user.rol === 'Administrador') ? false : true}>
            <NavDropdown.Item>
              <Link className='navigationBlogDropDown' to="/usersmanagement">GESTIÓN DE USUARIOS</Link>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <Link className='navigationBlogDropDown' to="/statistics">ESTADÍSTICAS</Link>
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <Nav.Link>
            <Button variant="primary" style={{margin:"0"}} className='FormButtonSalir' onClick={()=>handleShow2()}>
              CHATBOT
            </Button>
          </Nav.Link>
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

      <Modal className='SignUpModal' centered size='nm' show={show2} onHide={handleClose2} keyboard={false}>
        <Modal.Header className='SignUpModalHeader'>
        <Modal.Title>pregúntale a nuestro CHATBOT</Modal.Title>
        </Modal.Header>
        <Modal.Body className='DetailsModalBody'>
        <div className='passwordModal'>
          <img style={{width:"50%", marginRight:"1.5rem", marginTop: "2rem", marginBottom: "3rem"}} src={qr}/>
          <a className='navigationBlog' href='https://t.me/HelpCucei_bot' style={{marginRight:"1.5rem"}}>https://t.me/HelpCucei_bot</a>
        </div>
        </Modal.Body>
        <Modal.Footer className='signupfooter'>
        <Button variant="secondary" className='FormButtonPure' onClick={handleClose2}>
            Volver
        </Button>
        </Modal.Footer>
      </Modal>

    </Navbar>
    
  )
}
