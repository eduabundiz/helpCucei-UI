import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Toast, ToastContainer} from 'react-bootstrap';
import {notification} from 'antd';
import {useNavigate} from 'react-router-dom';
import Axios from 'axios';

export default function News({token}) {
    const [emptyCheck, setEmptyCheck] = useState(false);
    const [errorSignUp, setErrorSignUp] = useState(false);
    const [successSignUp, setSuccessSignUp] = useState(false);
    const [user, setUser] = useState({});

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const [post, setPost] = useState({});
    const [socialAreas, setSocialAreas] = useState([]);
    const [carreras, setCarreas] = useState([]);
    const [posts, setPosts] = useState([]);
    const [newsData, setnewsData] =useState({
        tema: "",
        contenido: "",
        fechaInicio: "",
        fechaFin: "",
        prioridad: 1,
        referencia: "",
        areasocial: "",
        imgurl: "",
        status: 1,
        estadoAprobacion: "PENDIENTE"
      });

      function handleTitle(obj){
        console.log("handleTema: ",obj.target.value)
        newsData.tema=obj.target.value
      }
      function handleContent(obj){
        console.log("handleContent: ",obj.target.value)
        newsData.contenido=obj.target.value
      }
      function handleSocialArea(obj){
        console.log("handleSocialArea: ",obj.target.value)
        newsData.areasocial=obj.target.value
      }
      function handleImgUrl(obj){
        console.log("handleImgUrl: ",obj.target.value)
        newsData.imgurl=obj.target.value
      }
      function handleRef(obj){
        console.log("handleRef: ",obj.target.value)
        newsData.referencia=obj.target.value
      }
      function handleStartDate(obj){
        console.log("handleStartDate: ",obj.target.value)
        newsData.fechaInicio=obj.target.value
      }
      function handleEndDate(obj){
        console.log("handleEndDate: ",obj.target.value)
        newsData.fechaFin=obj.target.value
      }


      const sendNew = () =>{
        //VALIDACIÓN CAMPOS VACÍOS
        if(
          newsData.tema === '' ||
          newsData.contenido === '' ||
          newsData.areasocial === ''
        ){
          setEmptyCheck(true);
          return;
        }
        //PETICIÓ POST PARA REGISTRAR POST
        try{
          console.log("REGISTRA");
          Axios.post('http://localhost:3001/api/news/insert',newsData).then(() => {
            notification.success({ message: 'Noticia enviada a revisión'});
            getPosts();
          });
          setShow(false)
        }catch{
          console.log("ERROR CATCH");
          setErrorSignUp(true);
        }
      };

  const PostCard = ({post}) =>{
    return(
        <div onClick={()=> {setPost(post); handleShow2();}} className="postCard">
            <div className="postCardContent">
              <div className='postCardTitle'>
                <h5 style={{marginBottom:"1rem"}}>{post.tema}</h5>
              </div>
              <div className='postCardInfo'>
                <p className='postInfo'>{post.contenido}</p>
              </div>
              <div>
                <img src={post.imgurl}
                className='postImage'
                />
                <a  className='linkToPassword' href={post.referencia} title="Forgot Password">{post.referencia}</a>
                <div style={{textAlign:"right"}}>
                  <h6 style={{color:"#0d6efd"}}>{post.nombreAreaSocial}</h6>
                </div>
              </div>
            </div>
        </div>
    )
}
const PostWidget = () =>{
  const items = posts.slice(0, 3)
  return(
      <div className="postWidget">
        <h6 style={{marginBottom:"2rem"}}>Noticias Recientes:</h6>
        {items.map((post)=>(
          <div className='pwl2'>
            <div className='pwl3'>
              <img
                className='pwimg'
                alt={post.tema}
                height="50px"
                width="50px"
                src={post.imgurl}
              />
            </div>
            <div>
              <p className='pwp'>{post.fechaInicio.toString().slice(0,10)}</p>
              <Button className='postwidgetbutton' onClick={()=> {setPost(post); handleShow2();}}>{post.tema}</Button>
            </div>
          </div>
        ))}
      </div>
  )
}
const CategoryWidget = () =>{
  return(
      <div className="categoryWidget">
        <h6 style={{marginBottom:"1rem"}}>Categorías:</h6>
        <Button className='postcategorybutton' onClick={()=> {getPosts()}}>* Todas</Button>
        {socialAreas.map((sa)=>(
          <div className='cwl2'>
            <Button className='postcategorybutton' onClick={()=> {getCategoryPosts(sa.nombre)}}>{sa.nombre}</Button>
          </div>
        ))}
      </div>
  )
}

  async function getUser(){
    try{
      await Axios.get('http://localhost:3001/api/getuser',{
        params: {correo: token}
      }
      ).then((response) => {
        setUser(response.data[0]);
    });
    }catch{
      console.log("ERROR GETTING USER")
    }
  }

  function getCarreras(){
    try{
      Axios.get('http://localhost:3001/api/carreras/get').then((response) => {
      setCarreas(response.data);
    });
    }catch{
      console.log("ERROR GETTING CARRERAS")
    }
  }

  function getPosts(){
    try{
      Axios.get('http://localhost:3001/api/news/get').then((response) => {
      console.log("GetPosts: ", response.data);
      const verifiedPosts = response.data.filter(post => post.estadoAprobacion === "APROBADO");
      if(verifiedPosts.length<=0){
        setPosts([{
          tema: "No hay noticias",
          contenido: "",
          fechaInicio: "",
          fechaFin: "",
          prioridad: 1,
          referencia: "",
          areasocial: "",
          imgurl: "https://us.123rf.com/450wm/blankstock/blankstock1409/blankstock140900061/31369711-signo-de-interrogaci%C3%B3n-signo-icono-s%C3%ADmbolo-de-ayuda-signo-de-preguntas-frecuentes-c%C3%ADrculo-bot%C3%B3n-plan.jpg?ver=6",
          status: 1,
          estadoAprobacion: "PENDIENTE"
        }])
      }else{setPosts(verifiedPosts.reverse());}
    });
    }catch{
      console.log("ERROR GETTING POSTS")
    }
  }

  function getCategoryPosts(socialArea){
    try{
      Axios.get('http://localhost:3001/api/news/categorynew',{
        params: {socialArea: socialArea}
      }).then((response) => {
      console.log("GetPosts: ", response.data);
      const verifiedPosts = response.data.filter(post => post.estadoAprobacion === "APROBADO");
      if(verifiedPosts.length<=0){
        setPosts([{
          tema: "No hay noticias",
          contenido: "",
          fechaInicio: "",
          fechaFin: "",
          prioridad: 1,
          referencia: "",
          areasocial: "",
          imgurl: "https://us.123rf.com/450wm/blankstock/blankstock1409/blankstock140900061/31369711-signo-de-interrogaci%C3%B3n-signo-icono-s%C3%ADmbolo-de-ayuda-signo-de-preguntas-frecuentes-c%C3%ADrculo-bot%C3%B3n-plan.jpg?ver=6",
          status: 1,
          estadoAprobacion: "PENDIENTE"
        }])
      }else{setPosts(verifiedPosts.reverse());}
    });
    }catch{
      console.log("ERROR GETTING POSTS")
    }
  }

  function getSocialAreas(){
    try{
      Axios.get('http://localhost:3001/api/socialareas/get').then((response) => {
      setSocialAreas(response.data);
    });
    }catch{
      console.log("ERROR GETTING SOCIAL AREAS")
    }
  }

  useEffect(() =>{
    getUser();
    getCarreras()
    getSocialAreas()
    getPosts()
  },[])
  
  return (
    <div style={{display: "flex", justifyContent: "center"}}>
        <div className='createPost'>
            <Button hidden={(user.rol === 'Supervisor' || user.rol ==='Administrador' || user.rol === 'Coordinador') ? false : true} variant="primary" className='FormButtonCrearPost' onClick={handleShow}>
                CREAR NOTICIA
            </Button>
        </div>
        <div className='homePosts'>
            {posts.map((post) => <PostCard post={post} key={post.title}/>)}
        </div>
        <div className='recent'>
          <PostWidget/>
          <CategoryWidget/>
        </div>

        <Modal className='SignUpModal' show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header className='SignUpModalHeader'>
        <Modal.Title>Nueva Noticia</Modal.Title>
        </Modal.Header>
        <Modal.Body className='SignUpModalBody'>
        <Form className='SignUpForm'>
            <Form.Group className="mb-3SingUp" controlId="formBasicTitle">
            <Form.Control className='formControlSignUp' type="text" placeholder="Tema*" onChange={(value)=>handleTitle(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" style={{width:"50%"}} controlId="formBasicContent">
            <textarea class="formControlTextArea" rows="8" placeholder='Contenido*' onChange={(value)=>handleContent(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" controlId="formBasicDateOfBirth">
            <Form.Label className="SignUpModalFormLabel">Fecha Inicio</Form.Label>
            <Form.Control className='formControlSignUpDate' type="date" name='date_of_birth' onChange={(value)=>handleStartDate(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" controlId="formBasicDateOfBirth">
            <Form.Label className="SignUpModalFormLabel">Fecha Fin</Form.Label>
            <Form.Control className='formControlSignUpDate' type="date" name='date_of_birth' onChange={(value)=>handleEndDate(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" controlId="formBasicSocialArea">
            <Form.Select className='formControlSignUpSelect' onChange={(value)=>handleSocialArea(value)}>
            <option>Area Social*</option>
            <option value="1">Importancia del Inglés</option>
            <option value="2">Pre-Registro</option>
            <option value="3">Agenda de Materias</option>
            <option value="4">Materias Optativas</option>
            <option value="5">Redes Sociales de la Coordinación</option>
            <option value="6">Articulos Reglamentarios</option>
            <option value="7">Prácticas Profesionales</option>
            <option value="8">Servicio Social</option>
            <option value="9">Materias Especializantes Selectivas</option>
            <option value="10">Modalidades de Titulación</option>
            <option value="11">Apoyos Económicos</option>
            <option value="12">Dictamen</option>
            <option value="13">Trámites SIATCE</option>
            <option value="14">Postgrados</option>
            <option value="15">Bolsa de Trabajo</option>
            <option value="16">Plan de Estudios</option>
            <option value="17">Trámites de Titulación</option>
            <option value="18">Proyectos Modulares</option>
            <option value="19">Diplomados, Cursos y Certificaciones</option>
            <option value="20">Otros</option>
            </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3SingUp" controlId="formBasicUrlImage">
            <Form.Control className='formControlSignUp' type="text" placeholder="Url Imagen" onChange={(value)=>handleImgUrl(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" controlId="formBasicComment">
            <Form.Control className='formControlSignUp' type="text" placeholder="Referencia" onChange={(value)=>handleRef(value)}/>
            </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer className='signupfooter'>
        <Button variant="secondary" className='FormButtonPure' onClick={handleClose}>
            Cancelar
        </Button>
        <Button variant="primary" className='FormButtonPure addmarginleft' onClick={sendNew}>
            Enviar
        </Button>
        </Modal.Footer>

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
            <Toast.Body>Asegúrate de llenar los campos obligatorios* .</Toast.Body>
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
            <Toast.Body>Noticia creada correctamente.</Toast.Body>
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
            <Toast.Body>Hubo un error al crear la Noticia.</Toast.Body>
        </Toast>
        </ToastContainer>

        <Modal className='SignUpModal' size='lg' show={show2} onHide={handleClose2} keyboard={false}>
        <Modal.Header className='SignUpModalHeader'>
        <Modal.Title>Detalles</Modal.Title>
        </Modal.Header>
        <Modal.Body className='DetailsModalBody'>
          <div className="postCard">
              <div className="postCardContent">
                <div className='postCardTitle'>
                  <h5 style={{marginBottom:"1rem"}}>{post.tema}</h5>
                </div>
                <div className='postCardInfo'>
                  <p className='postInfo'>{post.contenido}</p>
                </div>
                <div>
                  <img src={post.imgurl}
                  className='postImage'
                  />
                  <a  className='linkToPassword' href={post.referencia} title="Forgot Password">{post.referencia}</a>
                  <div style={{textAlign:"right"}}>
                    <h6 style={{color:"#0d6efd"}}>{post.nombreAreaSocial}</h6>
                  </div>
                </div>
              </div>
          </div>
        </Modal.Body>
        <Modal.Footer className='signupfooter'>
        <Button variant="secondary" className='FormButtonPure' onClick={handleClose2}>
            Volver
        </Button>
        </Modal.Footer>

        </Modal>

    </div>
  )
}
