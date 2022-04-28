import React, { useEffect, useState } from 'react';
import { Button, Form, Modal} from 'react-bootstrap';
import {message, notification} from 'antd';
import Axios from 'axios';
import md5 from 'crypto-js/md5'

export default function Profile({token}) {

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [pass, setPass] = useState();
  const [user, setUser] = useState({});
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

  async function getUser(){
    try{
      await Axios.get('http://localhost:3001/api/getfulluser',{
        params: {correo: token}
      }
      ).then((response) => {
        setUser(response.data[0]);
        console.log("USER: ", response.data[0]);
    });
    }catch{
      console.log("ERROR GETTING USER")
    }
  }

  function updateProfileData(){
    console.log("NewUserData: ", user);
    try{
      Axios.put('http://localhost:3001/api/user/update',{user: user}).then((response) => {
        console.log("response: ",response.data);
    });
    }catch{
      console.log("ERROR CHANGING STATUS")
    }
    notification.success({ message: 'Datos actualizados con éxito'});
  }

  function changePassword(){
    if(pass.length < 8){
      notification.error({ message: 'La contraseña debe tener mínimo 8 caracteres'});
      handleClose2();
      return;
    }
    if(password === signUpData.password){
      notification.success({ message: 'Las contraseñas coinciden'});
      try{
        Axios.put('http://localhost:3001/api/password/update',{password: password, id: user.id}).then((response) => {
          console.log("response: ",response.data);
      });
      }catch{
        console.log("ERROR CHANGING STATUS")
      }
      notification.success({ message: 'Contraseña actualizada con éxito'});
    }else{
      notification.error({ message: 'Las contraseñas no coinciden'});
      handleClose2();
      return
    }
    handleClose2();
  }

  function handleName(obj){
    console.log("handleName: ",obj.target.value)
    signUpData.name=obj.target.value
    user.nombre = obj.target.value
  }
  function handleLastName(obj){
    console.log("handleLastName: ",obj.target.value)
    signUpData.lastName=obj.target.value
    user.apellidoPaterno = obj.target.value
  }
  function handleSecondLastName(obj){
    console.log("handleSecondLastName: ",obj.target.value)
    signUpData.secondLastName=obj.target.value
    user.apellidoMaterno = obj.target.value
  }
  function handleDateOfBirth(obj){
    console.log("handleDateOfBirth: ",obj.target.value)
    signUpData.dateOfBirth=obj.target.value
    user.fechaNacimiento = obj.target.value
  }
  function handleCareer(obj){
    console.log("handleCareer: ",obj.target.value)
    signUpData.career=obj.target.value
    user.idCarrera = obj.target.value
  }
  function handleIngressDate(obj){
    console.log("handleIngressDate: ",obj.target.value)
    signUpData.ingressDate=obj.target.value
    user.fechaIngreso = obj.target.value
  }
  function handleEmail(obj){
    console.log("handleEmail: ",obj.target.value)
    signUpData.email=obj.target.value
    user.correo = obj.target.value
  }
  function handlePassword(obj){
    console.log("handlePassword: ",md5(obj.target.value).toString())
    signUpData.password=md5(obj.target.value).toString();
    setPass(obj.target.value);
  }
  function checkPassword(obj){
    console.log("checkPassword: ",obj.target.value)
    setPassword(md5(obj.target.value).toString());
  }

  useEffect(() =>{
    getUser();
  },[])
  
  return (
    <div id="cardprofile">
      <div id="card-content-profile">
        <div id="card-title-profile">
          <h3>Datos de usuario</h3>
        </div>
        <div className='profileForm'>
          <Form className='SignUpForm'>
            <Form.Group className="mb-3SingUp" controlId="formBasicName">
              <Form.Control defaultValue={user.nombre} className='formControlSignUp' type="text" placeholder="Nombre" onChange={(value)=>handleName(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" style={{width:"50%"}} controlId="formBasicLastName">
              <Form.Control defaultValue={user.apellidoPaterno} className='formControlSignUp' type="text" placeholder="Apellído paterno" onChange={(value)=>handleLastName(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" controlId="formBasicSecondLastName">
              <Form.Control defaultValue={user.apellidoMaterno} className='formControlSignUp' type="text" placeholder="Apellído materno" onChange={(value)=>handleSecondLastName(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" controlId="formBasicDateOfBirth">
              <Form.Label className="SignUpModalFormLabel">Fecha de nacimiento actual: {user.fechaNacimiento ? user.fechaNacimiento.toString().slice(0,10) : user.fechaNacimiento}</Form.Label>
              <Form.Control className='formControlSignUpDate' type="date" name='date_of_birth' onChange={(value)=>handleDateOfBirth(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" controlId="formBasicCareer">
              <Form.Label className="SignUpModalFormLabel">Carrera actual: {user.nombreCarrera}</Form.Label>
              <Form.Select className='formControlSignUpSelect' onChange={(value)=>handleCareer(value)}>
              <option disabled={true} selected>Seleccionar</option>
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
              <Form.Control defaultValue={user.fechaIngreso} className='formControlSignUp' type="text" placeholder="Calendario de ingreso" onChange={(value)=>handleIngressDate(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" controlId="formBasicEmail">
              <Form.Control disabled={true} defaultValue={user.correo} className='formControlSignUp' type="email" placeholder="Correo electrónico" onChange={(value)=>handleEmail(value)}/>
            </Form.Group>
            <Form.Group className="FooterButtonsProfile" style={{marginTop:"1rem"}}>
            <Button variant="primary" className='FormButtonProfile' style={{width:"100%"}} onClick={()=>handleShow2()}>
              Cambiar contraseña
            </Button>
            <Button variant="primary" className='FormButtonProfile' style={{width:"100%"}} onClick={()=>{updateProfileData()}}>
              Guardar
            </Button>
            </Form.Group>
          </Form>
        </div>
      </div>

      <Modal className='SignUpModal' centered size='nm' show={show2} onHide={handleClose2} keyboard={false}>
        <Modal.Header className='SignUpModalHeader'>
        <Modal.Title>Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body className='DetailsModalBody'>
        <div className='passwordModal'>
          <Form className='SignUpForm'>
            <Form.Group className="mb-3SingUp" controlId="formBasicPassword">
              <Form.Control className='formControlSignUp' type="password" placeholder="ingrese su nueva contraseña" onChange={(value)=>handlePassword(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" controlId="formBasicCheckPassword">
              <Form.Control className='formControlSignUp' type="password" placeholder="ingrese nuevamente su contraseña" onChange={(value)=>checkPassword(value)}/>
            </Form.Group>
          </Form>
        </div>
        </Modal.Body>
        <Modal.Footer className='signupfooter'>
        <Button variant="secondary" className='FormButtonPure' onClick={handleClose2}>
            Volver
        </Button>
        <Button variant="secondary" className='FormButtonPure' onClick={()=>changePassword()}>
            Guardar
        </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
