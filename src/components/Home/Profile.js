import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Toast, ToastContainer} from 'react-bootstrap';
import Axios from 'axios';
import md5 from 'crypto-js/md5'
import { SERVICES_URL } from '../../utils/constants';

export default function Profile({token}) {
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
              <Form.Label className="SignUpModalFormLabel">Fecha de nacimiento</Form.Label>
              <Form.Control disabled={true} value={user.fechaNacimiento ? user.fechaNacimiento.toString().slice(0,10) : user.fechaNacimiento} className='formControlSignUpDate' type="date" name='date_of_birth' onChange={(value)=>handleDateOfBirth(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" controlId="formBasicCareer">
              <Form.Select disabled={true} value={user.idCarrera ? user.idCarrera.toString() : user.idCarrera} className='formControlSignUpSelect' onChange={(value)=>handleCareer(value)}>
              <option>Carrera</option>
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
            <Button variant="primary" className='FormButtonProfile' style={{width:"100%"}}>
              Cambiar contraseña
            </Button>
            <Button variant="primary" className='FormButtonProfile' style={{width:"100%"}}>
              Guardar
            </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
  )
}
