import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Toast, ToastContainer} from 'react-bootstrap';
import {useParams} from "react-router-dom";
import Axios from 'axios';

export default function Profile() {
  const [successSignIn, setSuccessSignIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState({});
  let params = useParams();

  function getUsers(){
    try{
      Axios.get('http://localhost:3001/api/get').then((response) => {
      console.log("RESPONSE: ", response.data);
      setUsers(response.data);
      if(users.length > 0){
        users.forEach((e)=>{
          if(parseInt(params.user) == e.id){
            setLoggedUser(e)
          }
        })
      }
    });
    }catch{
      console.log("ERROR GET USERS")
    }
  }

  useEffect(() =>{
    setSuccessSignIn(true);
    getUsers()
  },[])
  
  return (
    <div>
      <div className='homeDiv'>
        <div className='homeLogo'>
          <label className='homeText'>Perfil</label>
        </div>
        <div className='homePhrase'>
          <label className='homeTextmin'>Vista de posts</label>
        </div>
      </div>
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
    </div>
  )
}
