import { Button, Form, Modal, Toast, ToastContainer} from 'react-bootstrap';
import './Login.css';
import helpCuceiLogo from '../assets/helpqci0.png'
import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function Login() {

  const [showToast, setShowToast] = useState(false);
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [password, setPassword] = useState();
  const [signUpData, setSignUpData] =useState({
    name: "",
    lastName: "",
    secondLastName: "",
    dateOfBirth: "",
    career: "",
    ingressDate: "",
    email: "",
    password: "",
    rol: "Estudiante"
  });
  const signUpUser = () =>{
    if(signUpData.password !== password){
      setShowToast(true)
      return;
    }
    setShow(false)
    try{
      console.log("REGISTRA");
      /*
      Axios.post('http://localhost:3001/api/insert',signUpData).then(() => {
        alert('successful insert')
      });
      */
    }catch{
      console.log("ERROR CATCH");
    }
    
  };


  useEffect(() =>{
    getUsers()
  },[])

  function getUsers(){
    Axios.get('http://localhost:3001/api/get').then((response) => {
      console.log("RESPONSE: ", response.data);
      setUsers(response.data);
    });
  }

  function handleName(obj){
    console.log("handleName: ",obj.target.value)
    signUpData.name=obj.target.value
  }
  function handleLastName(obj){
    console.log("handleLastName: ",obj.target.value)
    signUpData.lastName=obj.target.value
  }
  function handleSecondLastName(obj){
    console.log("handleSecondLastName: ",obj.target.value)
    signUpData.secondLastName=obj.target.value
  }
  function handleDateOfBirth(obj){
    console.log("handleDateOfBirth: ",obj.target.value)
    signUpData.dateOfBirth=obj.target.value
  }
  function handleCareer(obj){
    console.log("handleCareer: ",obj.target.value)
    signUpData.career=obj.target.value
  }
  function handleIngressDate(obj){
    console.log("handleIngressDate: ",obj.target.value)
    signUpData.ingressDate=obj.target.value
  }
  function handleEmail(obj){
    console.log("handleEmail: ",obj.target.value)
    signUpData.email=obj.target.value
  }
  function handlePassword(obj){
    console.log("handlePassword: ",obj.target.value)
    signUpData.password=obj.target.value
  }
  function checkPassword(obj){
    console.log("checkPassword: ",obj.target.value)
    setPassword(obj.target.value)
  }

  function showSignUpData(){
    console.log("SignUp DATA: ", signUpData)
    console.log("USERS: ", users);
  }

  return (
    <body>
    <div id="card">
      <div id="card-content">
        <div id="card-title">
          <img src={helpCuceiLogo} className='LogoLogin'/>
          </div>
          <div className='LoginForm'>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>CORREO ELECTRÓNICO</Form.Label>
              <Form.Control className='formControl' type="email" placeholder="Ingrese su correo electrónico" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>CONTRASEÑA</Form.Label>
              <Form.Control className='formControl' type="password" placeholder="ingrese su contraseña" />
              <a  className='linkToPassword' href="App.js" title="Forgot Password">* olvidé mi contraseña</a>
            </Form.Group>
            <Form.Group className="FooterButtons">
              <Button variant="primary" type="submit" className='FormButton'>
                Ingresar
              </Button>
              <Button variant="primary" className='FormButton' onClick={handleShow}>
                Registrarse
              </Button>
            </Form.Group>
          </Form>
          </div>
      </div>
    </div>
    <Modal className='SignUpModal' show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header className='SignUpModalHeader'>
        <Modal.Title>Registro en HelpCUCEI</Modal.Title>
      </Modal.Header>
      <Modal.Body className='SignUpModalBody'>
        <Form className='SignUpForm'>
          <Form.Group className="mb-3SingUp" controlId="formBasicName">
            <Form.Control className='formControlSignUp' type="text" placeholder="Ingrese su nombre" onChange={(value)=>handleName(value)}/>
          </Form.Group>
          <Form.Group className="mb-3SingUp" style={{width:"50%"}} controlId="formBasicLastName">
            <Form.Control className='formControlSignUp' type="text" placeholder="Ingrese su apellído paterno" onChange={(value)=>handleLastName(value)}/>
          </Form.Group>
          <Form.Group className="mb-3SingUp" controlId="formBasicSecondLastName">
            <Form.Control className='formControlSignUp' type="text" placeholder="Ingrese su apellído materno" onChange={(value)=>handleSecondLastName(value)}/>
          </Form.Group>
          <Form.Group className="mb-3SingUp" controlId="formBasicDateOfBirth">
            <Form.Label className="SignUpModalFormLabel">Fecha de nacimiento</Form.Label>
            <Form.Control className='formControlSignUpDate' type="date" name='date_of_birth' onChange={(value)=>handleDateOfBirth(value)}/>
          </Form.Group>
          <Form.Group className="mb-3SingUp" controlId="formBasicCareer">
            <Form.Select className='formControlSignUpSelect' onChange={(value)=>handleCareer(value)}>
            <option>Seleccione su carrera</option>
            <option value="1">Licenciatura en Física</option>
            <option value="2">Licenciatura en Matemáticas</option>
            <option value="3">Licenciatura en Química</option>
            <option value="4">Licenciatura en Químico Farmacéutico Biólogo</option>
            <option value="5">Licenciatura en Ciencia de Materiales</option>
            <option value="6">Ingeniería Civil</option>
            <option value="7">Ingeniería en Alimentos y Biotecnología</option>
            <option value="8">Ingeniería Topográfica</option>
            <option value="9">Ingeniería Industrial</option>
            <option value="10">Ingeniería Mecánica Eléctrica</option>
            <option value="11">Ingeniería Química</option>
            <option value="12">Ingeniería en Logística y Transporte</option>
            <option value="13">Ingeniería Informática</option>
            <option value="14">Ingeniería Biomédica</option>
            <option value="15">Ingeniería en Computación</option>
            <option value="16">Ingeniería en Comunicaciones y Electrónica</option>
            <option value="17">Ingeniería Fotónica</option>
            <option value="18">Ingeniería Robótica</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3SingUp" controlId="formBasicIngressDate">
            <Form.Control className='formControlSignUp' type="text" placeholder="Ingrese su calendario de ingreso" onChange={(value)=>handleIngressDate(value)}/>
          </Form.Group>
          <Form.Group className="mb-3SingUp" controlId="formBasicEmail">
            <Form.Control className='formControlSignUp' type="email" placeholder="Ingrese su correo electrónico" onChange={(value)=>handleEmail(value)}/>
          </Form.Group>
          <Form.Group className="mb-3SingUp" controlId="formBasicPassword">
            <Form.Control className='formControlSignUp' type="password" placeholder="ingrese su contraseña" onChange={(value)=>handlePassword(value)}/>
          </Form.Group>
          <Form.Group className="mb-3SingUp" controlId="formBasicCheckPassword">
            <Form.Control className='formControlSignUp' type="password" placeholder="ingrese nuevamente su contraseña" onChange={(value)=>checkPassword(value)}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" className='FormButtonPure' onClick={showSignUpData}>
          Try
        </Button>
        <Button variant="secondary" className='FormButtonPure' onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" className='FormButtonPure' onClick={signUpUser}>
          Registrarse
        </Button>
      </Modal.Footer>
      <ToastContainer position="top-center" className="p-3">
      <Toast onClose={() => setShowToast(false)} show={showToast} delay={2000} autohide>
        <Toast.Header>
          <img
            src="holder.js/20x20?text=%20"
            className="rounded me-2"
            alt=""
          />
          <strong className="me-auto">ERROR</strong>
        </Toast.Header>
        <Toast.Body>LAS CONTRASEÑAS NO COINCIDEN.</Toast.Body>
      </Toast>
    </ToastContainer>
    </Modal>

    
  </body>
  );
}

export default Login;
