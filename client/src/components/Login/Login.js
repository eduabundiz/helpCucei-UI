import { Button, Form, Modal, Toast, ToastContainer} from 'react-bootstrap';
import {notification} from 'antd';
import './Login.css';
import helpCuceiLogo from '../../assets/helpqci.png'
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import md5 from 'crypto-js/md5'
import PropTypes from 'prop-types';
import { SERVICES_URL } from '../../utils/constants';


async function loginUser(credentials) {
  try{
    return fetch(SERVICES_URL+'/api/login', {
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
  const [shortPassword, setShortPassword] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);
  const [emptyCheck, setEmptyCheck] = useState(false);
  const [badEmail, setBadEmail] = useState(false);
  const [errorSignUp, setErrorSignUp] = useState(false);
  const [successSignUp, setSuccessSignUp] = useState(false);
  const [successSignIn, setSuccessSignIn] = useState(false);
  const [failedSignIn, setFailedSignIn] = useState(false);

  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [pass, setPass] = useState();
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
    const ValidEmail = new RegExp(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
    //VALIDACI??N CAMPOS VAC??OS
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
    //VALIDAR DIRECCI??N DE CORREO
    if(!ValidEmail.test(signUpData.email)){
      setBadEmail(true);
      return;
    }
    //CONTRASE??A 8 CARACTERES MIN
    if(pass.length < 8){
      setShortPassword(true)
      return;
    }

    //VALIDACI??N CONTRASE??AS COINCIDEN
    if(signUpData.password !== password){
      setPasswordCheck(true)
      return;
    }
    //VALIDACI??N CORREO YA REGISTRADO
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
    //PETICI?? POST PARA REGISTRAR USUARIO
    try{
      const current = new Date();
      const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;
      signUpData.signUpDate = date;
      console.log("REGISTRA");
      Axios.post(SERVICES_URL+'/api/insert',signUpData).then(() => {
        setSuccessSignUp(true);
      });
      setShow(false)
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
    notification.error({ message: 'Datos de inicio de sesi??n incorrectos'});
  }
  }
  
  function getUsers(){
    try{
      Axios.get(SERVICES_URL+'/api/get').then((response) => {
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
    setPass(obj.target.value);
  }
  function checkPassword(obj){
    //console.log("checkPassword: ",obj.target.value)
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
              <Form.Label>Correo electr??nico</Form.Label>
              <Form.Control className='formControl' type="email" onChange={(value)=>handleSignInEmail(value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contrase??a</Form.Label>
              <Form.Control className='formControl' type="password" onChange={(value)=>handleSignInPassword(value)}/>
              {/*<a  className='linkToPassword' href="App.js" title="Forgot Password">* olvid?? mi contrase??a</a>*/}
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
            <Form.Control className='formControlSignUp' type="text" placeholder="Ingrese su apell??do paterno" onChange={(value)=>handleLastName(value)}/>
          </Form.Group>
          <Form.Group className="mb-3SingUp" controlId="formBasicSecondLastName">
            <Form.Control className='formControlSignUp' type="text" placeholder="Ingrese su apell??do materno" onChange={(value)=>handleSecondLastName(value)}/>
          </Form.Group>
          <Form.Group className="mb-3SingUp" controlId="formBasicDateOfBirth">
            <Form.Label className="SignUpModalFormLabel">Fecha de nacimiento</Form.Label>
            <Form.Control className='formControlSignUpDate' type="date" name='date_of_birth' onChange={(value)=>handleDateOfBirth(value)}/>
          </Form.Group>
          <Form.Group className="mb-3SingUp" controlId="formBasicCareer">
            <Form.Select className='formControlSignUpSelect' onChange={(value)=>handleCareer(value)}>
            <option>Seleccione su carrera</option>
            <option value="1">Licenciatura en F??sica</option>
            <option value="2">Licenciatura en Matem??ticas</option>
            <option value="3">Licenciatura en Qu??mica</option>
            <option value="4">Licenciatura en Qu??mico Farmac??utico Bi??logo</option>
            <option value="5">Licenciatura en Ciencia de Materiales</option>
            <option value="6">Ingenier??a Civil</option>
            <option value="7">Ingenier??a en Alimentos y Biotecnolog??a</option>
            <option value="8">Ingenier??a Topogr??fica</option>
            <option value="9">Ingenier??a Industrial</option>
            <option value="10">Ingenier??a Mec??nica El??ctrica</option>
            <option value="11">Ingenier??a Qu??mica</option>
            <option value="12">Ingenier??a en Log??stica y Transporte</option>
            <option value="13">Ingenier??a Inform??tica</option>
            <option value="14">Ingenier??a Biom??dica</option>
            <option value="15">Ingenier??a en Computaci??n</option>
            <option value="16">Ingenier??a en Comunicaciones y Electr??nica</option>
            <option value="17">Ingenier??a Fot??nica</option>
            <option value="18">Ingenier??a Rob??tica</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3SingUp" controlId="formBasicIngressDate">
            <Form.Control className='formControlSignUp' type="text" placeholder="Ingrese su calendario de ingreso (ej. 2019A)" onChange={(value)=>handleIngressDate(value)}/>
          </Form.Group>
          <Form.Group className="mb-3SingUp" controlId="formBasicEmail">
            <Form.Control className='formControlSignUp' type="email" placeholder="Ingrese su correo electr??nico" onChange={(value)=>handleEmail(value)}/>
          </Form.Group>
          <Form.Group className="mb-3SingUp" controlId="formBasicPassword">
            <Form.Control className='formControlSignUp' type="password" placeholder="ingrese su contrase??a" onChange={(value)=>handlePassword(value)}/>
          </Form.Group>
          <Form.Group className="mb-3SingUp" controlId="formBasicCheckPassword">
            <Form.Control className='formControlSignUp' type="password" placeholder="ingrese nuevamente su contrase??a" onChange={(value)=>checkPassword(value)}/>
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
        <Toast.Body>las contrase??as no coinciden.</Toast.Body>
      </Toast>
    </ToastContainer>

    <ToastContainer position="top-center" className="p-3">
      <Toast onClose={() => setShortPassword(false)} show={shortPassword} delay={2000} autohide>
        <Toast.Header>
          <img
            src="holder.js/20x20?text=%20"
            className="rounded me-2"
            alt=""
          />
          <strong className="me-auto">ERROR</strong>
        </Toast.Header>
        <Toast.Body>La contrase??a debe tener 8 caracteres como m??nimo.</Toast.Body>
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
        <Toast.Body>Correo electr??nico ya registrado.</Toast.Body>
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
        <Toast.Body>Aseg??rate de llenar todos los campos.</Toast.Body>
      </Toast>
    </ToastContainer>

    <ToastContainer position="top-center" className="p-3">
      <Toast onClose={() => setBadEmail(false)} show={badEmail} delay={2000} autohide>
        <Toast.Header>
          <img
            src="holder.js/20x20?text=%20"
            className="rounded me-2"
            alt=""
          />
          <strong className="me-auto">ERROR</strong>
        </Toast.Header>
        <Toast.Body>Ingresa un correo electr??nico v??lido.</Toast.Body>
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
          <strong className="me-auto">NOTIFICACI??N</strong>
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
          <strong className="me-auto">NOTIFICACI??N</strong>
        </Toast.Header>
        <Toast.Body>Inicio de sesi??n correcto.</Toast.Body>
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
        <Toast.Body>Datos de inicio de sesi??n incorrectos.</Toast.Body>
      </Toast>
    </ToastContainer>

  </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}