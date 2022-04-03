import { Button, Form, Modal, Toast, ToastContainer} from 'react-bootstrap';
import {notification} from 'antd';
import './Login.css';
import helpCuceiLogo from '../../assets/helpqci.png'
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import md5 from 'crypto-js/md5'
import PropTypes from 'prop-types';


async function loginUser(credentials) {
  try{
    return fetch('http://localhost:3001/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then((data) => data.json())
  }catch{
    console.log("ERROR");
  }
 }

export default function Login({setToken}) {
  //const navigate = useNavigate()


  //NOTIFICACIONES
  const [passwordCheck, setPasswordCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);
  const [emptyCheck, setEmptyCheck] = useState(false);
  const [errorSignUp, setErrorSignUp] = useState(false);
  const [successSignUp, setSuccessSignUp] = useState(false);
  const [successSignIn, setSuccessSignIn] = useState(false);
  const [failedSignIn, setFailedSignIn] = useState(false);

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
    rol: "Estudiante",
    signUpDate: ""
  });
  const [username, setUserName] = useState();
  const [password2, setPassword2] = useState();

  const signUpUser = () =>{
    //VALIDACIÓN CAMPOS VACÍOS
    if(
      signUpData.name === '' ||
      signUpData.lastName === '' ||
      signUpData.secondLastName === '' ||
      signUpData.dateOfBirth === '' ||
      signUpData.career === '' ||
      signUpData.ingressDate === '' ||
      signUpData.email === '' ||
      signUpData.password === ''
    ){
      setEmptyCheck(true);
      return;
    }
    //VALIDACIÓN CONTRASEÑAS COINCIDEN
    if(signUpData.password !== password){
      setPasswordCheck(true)
      return;
    }
    //VALIDACIÓN CORREO YA REGISTRADO
    var flag = 0;
    users.forEach( (e) =>{
      if (e.correo === signUpData.email){
        flag = 1;
        setEmailCheck(true)
      };
    });
    if(flag===1){
      return;
    }
    //PETICIÓ POST PARA REGISTRAR USUARIO
    try{
      const current = new Date();
      const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;
      signUpData.signUpDate = date;
      console.log("REGISTRA");
      Axios.post('http://localhost:3001/api/insert',signUpData).then(() => {
        alert('successful insert')
      });
      setShow(false)
      setSuccessSignUp(true);
    }catch{
      console.log("ERROR CATCH");
      setErrorSignUp(true);
    }
  };


  useEffect(() =>{
    getUsers()
  },[])

  const handleSubmit = async e => {
    e.preventDefault();
    try{
    const token = await loginUser({
      username,
      password2
    });
    setToken(token);
  }catch{
    notification.error({ message: 'Datos de inicio de sesión incorrectos'});
  }
  }
  
  function getUsers(){
    try{
      Axios.get('http://localhost:3001/api/get').then((response) => {
      setUsers(response.data);
    });
    }catch{
      console.log("ERROR GET USERS")
    }
  }

  function handleSignInEmail(obj){
    console.log("handleSignInEmail: ",obj.target.value)
    setUserName(obj.target.value)
  }
  function handleSignInPassword(obj){
    console.log("handleSignInPassword: ",md5(obj.target.value).toString())
    setPassword2(md5(obj.target.value).toString());
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
    console.log("handlePassword: ",md5(obj.target.value).toString())
    signUpData.password=md5(obj.target.value).toString();
  }
  function checkPassword(obj){
    console.log("checkPassword: ",obj.target.value)
    setPassword(md5(obj.target.value).toString());
  }

  return (
    <div>
    <div id="card">
      <div id="card-content">
        <div id="card-title">
          <img src={helpCuceiLogo} className='LogoLogin'/>
          </div>
          <div className='LoginForm'>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control className='formControl' type="email" onChange={(value)=>handleSignInEmail(value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control className='formControl' type="password" onChange={(value)=>handleSignInPassword(value)}/>
              <a  className='linkToPassword' href="App.js" title="Forgot Password">* olvidé mi contraseña</a>
            </Form.Group>
            <Form.Group className="FooterButtons">
              <Button variant="primary" className='FormButton' onClick={handleSubmit}>
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
      <Modal.Footer className='signupfooter'>
        <Button variant="secondary" className='FormButtonPure' onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" className='FormButtonPure addmarginleft' onClick={signUpUser}>
          Registrarse
        </Button>
      </Modal.Footer>

      <ToastContainer position="top-center" className="p-3">
      <Toast onClose={() => setPasswordCheck(false)} show={passwordCheck} delay={2000} autohide>
        <Toast.Header>
          <img
            src="holder.js/20x20?text=%20"
            className="rounded me-2"
            alt=""
          />
          <strong className="me-auto">ERROR</strong>
        </Toast.Header>
        <Toast.Body>las contraseñas no coinciden.</Toast.Body>
      </Toast>
    </ToastContainer>

    <ToastContainer position="top-center" className="p-3">
      <Toast onClose={() => setEmailCheck(false)} show={emailCheck} delay={2000} autohide>
        <Toast.Header>
          <img
            src="holder.js/20x20?text=%20"
            className="rounded me-2"
            alt=""
          />
          <strong className="me-auto">ERROR</strong>
        </Toast.Header>
        <Toast.Body>Correo electrónico ya registrado.</Toast.Body>
      </Toast>
    </ToastContainer>

    <ToastContainer position="top-center" className="p-3">
      <Toast onClose={() => setEmptyCheck(false)} show={emptyCheck} delay={2000} autohide>
        <Toast.Header>
          <img
            src="holder.js/20x20?text=%20"
            className="rounded me-2"
            alt=""
          />
          <strong className="me-auto">ERROR</strong>
        </Toast.Header>
        <Toast.Body>Asegúrate de llenar todos los campos.</Toast.Body>
      </Toast>
    </ToastContainer>

    </Modal>

    <ToastContainer position="top-end" className="p-3">
      <Toast onClose={() => setSuccessSignUp(false)} show={successSignUp} delay={2000} autohide>
        <Toast.Header>
          <img
            src="holder.js/20x20?text=%20"
            className="rounded me-2"
            alt=""
          />
          <strong className="me-auto">NOTIFICACIÓN</strong>
        </Toast.Header>
        <Toast.Body>Usuario registrado correctamente.</Toast.Body>
      </Toast>
    </ToastContainer>

    <ToastContainer position="top-end" className="p-3">
      <Toast onClose={() => setErrorSignUp(false)} show={errorSignUp} delay={2000} autohide>
        <Toast.Header>
          <img
            src="holder.js/20x20?text=%20"
            className="rounded me-2"
            alt=""
          />
          <strong className="me-auto">ERROR</strong>
        </Toast.Header>
        <Toast.Body>Hubo un error al registrar el usuario.</Toast.Body>
      </Toast>
    </ToastContainer>

    <ToastContainer position="top-end" className="p-3">
      <Toast onClose={() => setSuccessSignIn(false)} show={successSignIn} delay={2000} autohide>
        <Toast.Header>
          <img
            src="holder.js/20x20?text=%20"
            className="rounded me-2"
            alt=""
          />
          <strong className="me-auto">NOTIFICACIÓN</strong>
        </Toast.Header>
        <Toast.Body>Inicio de sesión correcto.</Toast.Body>
      </Toast>
    </ToastContainer>

    <ToastContainer position="top-end" className="p-3">
      <Toast onClose={() => setFailedSignIn(false)} show={failedSignIn} delay={2000} autohide>
        <Toast.Header>
          <img
            src="holder.js/20x20?text=%20"
            className="rounded me-2"
            alt=""
          />
          <strong className="me-auto">ERROR</strong>
        </Toast.Header>
        <Toast.Body>Datos de inicio de sesión incorrectos.</Toast.Body>
      </Toast>
    </ToastContainer>

  </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}