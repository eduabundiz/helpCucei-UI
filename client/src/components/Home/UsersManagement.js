import React, { useEffect, useState } from 'react';
import {Modal, Table, Button} from 'antd';
import {Form} from 'react-bootstrap';
import {notification} from 'antd';
import 'antd/dist/antd.css';
import Axios from 'axios';

export default function UsersManagement({token}) {

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [modalVisualizar, setModalVisualizar] = useState(false);

  function getUsers(){
    try{
      Axios.get('http://localhost:3001/api/get').then((response) => {
      setUsers(response.data);
    });
    }catch{
      console.log("ERROR GET USERS")
    }
  }

  const changeRole = (role) =>{
    console.log("Rol: ", role, " | ",user.id);
    try{
        Axios.put('http://localhost:3001/api/role/update',{rol: role, id: user.id}).then((response) => {
          console.log("status: ",response.data);
          getUsers();
          notification.success({ message: 'Permisos de usuario actualizados'});
      });
      }catch{
        console.log("ERROR CHANGING STATUS")
      }
      setModalVisualizar(!modalVisualizar);
  }

  useEffect(() =>{
    getUsers();
  },[])

  function handleRole(obj){
    console.log("handleRole: ",obj.target.value)
    user.rol=obj.target.value
  }

  const columnsPosts = [
  {
      title: "NOMBRE",
      dataIndex: "nombre",
      key: "nombre",
      className: "documents-column-css"
  },
  {
      title: "A. PATERNO",
      dataIndex: "apellidoPaterno",
      key: "apellidoPaterno",
      className: "documents-column-css textCenter"
  },
  {
      title: "A. MATERNO",
      dataIndex: "apellidoMaterno",
      key: "apellidoMaterno",
      className: "documents-column-css textCenter"
  },
  {
    title: "CORREO",
    dataIndex: "correo",
    key: "correo",
    className: "documents-column-css textCenter"
  },
  {
    title: "ROL",
    dataIndex: "rol",
    key: "rol",
    className: "documents-column-css textCenter"
  },
  {
    title: "ACCIONES",
    key: "accion",
    className: "documents-column-css textCenter",
    render: (fila) => (
      <div>
        <Button type='primary' disabled={fila.id===8||fila.id===9||fila.id===10} className='buttonVisualizar'onClick={()=>{setUser(fila) || setModalVisualizar(!modalVisualizar)}} >Cambiar Permisos</Button>
      </div>
    )
  }
  ]

  return (
  <div style={{display: "flex", justifyContent: "center"}}>
    <style>{'body{background-color: rgb(219, 232, 255) !important;}'}</style>
      <div className='checkPostTableDiv'>
        <h4 style={{marginBottom: "2rem"}}>GESTIÓN DE USUARIOS</h4>
        <Table className='checkPostTable' columns={columnsPosts} dataSource={users} bordered={true}/>
      </div>
      
      <Modal
            destroyOnClose={true}
            className="modalRevisar"
            width={400}
            visible={modalVisualizar}
            title={<label style={{ color: "black"}}>DETALLES DE USUARIO</label>}
            onCancel={() =>{setModalVisualizar(!modalVisualizar)}}
            footer={[
              <Button type='primary' danger style={{width:"6rem"}} onClick={() => {setModalVisualizar(!modalVisualizar)}}>
              Cancelar
              </Button>,
              <Button type='primary' style={{width:"6rem"}} onClick={() => {changeRole(user.rol)}}>
              Aceptar
              </Button>,
            ]}>
            <Form className='SignUpForm' id='RoleForm'>
              <Form.Group className="mb-3SingUp" controlId="formBasicName">
                <Form.Label className="SignUpModalFormLabel">Nombre:</Form.Label>
                <Form.Control defaultValue={user.nombre} disabled={true} className='formControlSignUp' type="text" placeholder="Nombre"/>
              </Form.Group>
              <Form.Group className="mb-3SingUp" style={{width:"50%"}} controlId="formBasicLastName">
                <Form.Label className="SignUpModalFormLabel">Apellído Paterno:</Form.Label>
                <Form.Control defaultValue={user.apellidoPaterno} disabled={true} className='formControlSignUp' type="text" placeholder="Apellído paterno"/>
              </Form.Group>
              <Form.Group className="mb-3SingUp" controlId="formBasicSecondLastName">
                <Form.Label className="SignUpModalFormLabel">Apellído Materno:</Form.Label>
                <Form.Control defaultValue={user.apellidoMaterno} disabled={true} className='formControlSignUp' type="text" placeholder="Apellído materno"/>
              </Form.Group>
              <Form.Group className="mb-3SingUp" controlId="formBasicCareer">
                <Form.Label className="SignUpModalFormLabel">Tipo de Usuario:</Form.Label>
                <Form.Select className='formControlSignUpSelect' onChange={(value)=>handleRole(value)}>
                <option selected disabled hidden>SELECCIONE NUEVO ROL</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Coordinador">Coordinador</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Administrador">Administrador</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal>
  </div>
  )
  }
