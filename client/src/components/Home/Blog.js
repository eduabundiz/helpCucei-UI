import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Toast, ToastContainer} from 'react-bootstrap';
import {notification} from 'antd';
import {useNavigate} from 'react-router-dom';
import {Link, useParams} from "react-router-dom";
import Axios from 'axios';
import { SERVICES_URL } from '../../utils/constants';

export default function Blog({token}) {
    const [emptyCheck, setEmptyCheck] = useState(false);
    const [noComment, setNoComment] = useState(false);
    const [errorSignUp, setErrorSignUp] = useState(false);
    const [successSignUp, setSuccessSignUp] = useState(false);
    const navigate = useNavigate()

    const [post, setPost] = useState({});
    const [user, setUser] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const [socialAreas, setSocialAreas] = useState([]);
    const [carreras, setCarreas] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [postData, setPostData] =useState({
        idUsuario: "",
        titulo: "",
        contenido: "",
        carrera: "",
        areasocial: "",
        comentario: "",
        imgurl: "",
        fecha: "",
        status: 1,
        estadoAprobacion: "PENDIENTE"
      });

    const [postComment, setPostComment] =useState({
      idUsuario: "",
      contenido: "",
      fecha: "",
      idPost: "",
      comentario: "",
      status: 1,
      estadoAprobacion: "PENDIENTE"
    });

      function handleTitle(obj){
        console.log("handleTitle: ",obj.target.value)
        postData.titulo=obj.target.value
      }
      function handleContent(obj){
        console.log("handleContent: ",obj.target.value)
        postData.contenido=obj.target.value
      }
      function handleCareer(obj){
        console.log("handleCareer: ",obj.target.value)
        postData.carrera=obj.target.value
      }
      function handleSocialArea(obj){
        console.log("handleSocialArea: ",obj.target.value)
        postData.areasocial=obj.target.value
      }
      function handleComment(obj){
        console.log("handleComment: ",obj.target.value)
        postData.comentario=obj.target.value
      }
      function handlePostComment(obj){
        console.log("handlePostComment: ",obj.target.value)
        postComment.contenido = obj.target.value;
        //setPostComment(obj.target.value);
      }
      function handleImgUrl(obj){
        console.log("handleImgUrl: ",obj.target.value)
        postData.imgurl=obj.target.value
      }

      const sendComment = () =>{
        console.log("ENTRA")
        postComment.idUsuario = user.id;
        postComment.idPost = post.id;
        const current = new Date();
        const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;
        postComment.fecha=date
        if(postComment.contenido === ''){
          setNoComment(true);
          return;
        }else{
          try{
            console.log("ENVÍA COMMENT");
            Axios.post(SERVICES_URL+'/api/comments/insert',postComment).then(() => {
              notification.success({ message: 'Comentario enviado'})
            })
            getComments(post.id);
          }catch{
            console.log("ERROR CATCH");
          }
        }
        setShow2(false);
      }

      const sendPost = () =>{
        postData.idUsuario = user.id;
        const current = new Date();
        const date = `${current.getDate()}-${current.getMonth()+1}-${current.getFullYear()}`;
        postData.fecha=date
        //VALIDACIÓN CAMPOS VACÍOS
        if(
          postData.titulo === '' ||
          postData.contenido === '' ||
          postData.areasocial === '' ||
          postData.carrera === '' 
        ){
          setEmptyCheck(true);
          return;
        }
        //PETICIÓ POST PARA REGISTRAR POST
        try{
          console.log("REGISTRA");
          Axios.post(SERVICES_URL+'/api/posts/insert',postData).then(() => {
            notification.success({ message: 'Post enviado a revisión'});
            getPosts();
          });
          setShow(false)
        }catch{
          console.log("ERROR CATCH");
          setErrorSignUp(true);
        }
       console.log("NEWPOST: ", postData)
      };

  const PostCard = ({post}) =>{
    return(
        <div className="postCard">
            <div className="postCardContent">
              <div className='postCardTitle'>
                <h5 style={{marginBottom:"1rem"}}>{post.titulo}</h5>
              </div>
              <div className='postCardInfo'>
                <p className='postInfo'>{post.contenido}</p>
              </div>
              <div>
                <img src={post.imgurl}
                className='postImage'
                />
                <div className='postcardfooter'>
                  <h6 style={{color:"#0d6efd"}}>{post.nombreAreaSocial}</h6>
                  <h6 style={{marginLeft:"2rem", color:"#c0c0c0"}}>{post.nombreCarrera}</h6>
                  <Button className='buttonComentarios' onClick={()=> {setPost(post); getComments(post.id); handleShow2();}}>Comentarios</Button>
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
        <h6 style={{marginBottom:"2rem"}}>Publicaciones Recientes:</h6>
        {items.map((post)=>(
          <div className='pwl2'>
            <div className='pwl3'>
              <img
                className='pwimg'
                alt={post.titulo}
                height="50px"
                width="50px"
                src={post.imgurl}
              />
            </div>
            <div>
              <p className='pwp'>{post.fecha}</p>
              <Button className='postwidgetbutton' onClick={()=> {setPost(post); getComments(post.id); handleShow2();}}>{post.titulo}</Button>
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

  function getCarreras(){
    try{
      Axios.get(SERVICES_URL+'/api/carreras/get').then((response) => {
      setCarreas(response.data);
    });
    }catch{
      console.log("ERROR GETTING CARRERAS")
    }
  }

  function getComments(id){
    console.log("comment post id ",id);
    try{
      Axios.get(SERVICES_URL+'/api/comments/get', {params:{id: id}}).then((response) => {
      console.log("GetComments: ", response.data);
      const verifiedPosts = response.data.filter(post => post.estadoAprobacion === "APROBADO");
      if(verifiedPosts.length<=0){
        setComments([{
          nombre: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          contenido: "No hay comentarios para esta publicación",
          status: 1,
          estadoAprobacion: "PENDIENTE",
          fecha: ""
        }])
      }else{setComments(verifiedPosts.reverse());}
    });
    }catch{
      console.log("ERROR GETTING POSTS")
    }
  }

  function getPosts(){
    try{
      Axios.get(SERVICES_URL+'/api/posts/get').then((response) => {
      console.log("GetPosts: ", response.data);
      const verifiedPosts = response.data.filter(post => post.estadoAprobacion === "APROBADO");
      if(verifiedPosts.length<=0){
        setPosts([{
          idUsuario: "1",
          titulo: "No hay publicaciones",
          contenido: "",
          carrera: "",
          areasocial: "",
          comentario: "",
          imgurl: "https://us.123rf.com/450wm/blankstock/blankstock1409/blankstock140900061/31369711-signo-de-interrogaci%C3%B3n-signo-icono-s%C3%ADmbolo-de-ayuda-signo-de-preguntas-frecuentes-c%C3%ADrculo-bot%C3%B3n-plan.jpg?ver=6",
          fecha: "",
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
      Axios.get(SERVICES_URL+'/api/posts/categoryposts',{
        params: {socialArea: socialArea}
      }).then((response) => {
      console.log("GetPosts: ", response.data);
      const verifiedPosts = response.data.filter(post => post.estadoAprobacion === "APROBADO");
      if(verifiedPosts.length<=0){
        setPosts([{
          idUsuario: "1",
          titulo: "No hay publicaciones",
          contenido: "",
          carrera: "",
          areasocial: "",
          comentario: "",
          imgurl: "https://us.123rf.com/450wm/blankstock/blankstock1409/blankstock140900061/31369711-signo-de-interrogaci%C3%B3n-signo-icono-s%C3%ADmbolo-de-ayuda-signo-de-preguntas-frecuentes-c%C3%ADrculo-bot%C3%B3n-plan.jpg?ver=6",
          fecha: "",
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
      Axios.get(SERVICES_URL+'/api/socialareas/get').then((response) => {
      setSocialAreas(response.data);
    });
    }catch{
      console.log("ERROR GETTING SOCIAL AREAS")
    }
  }

  useEffect(() =>{
    getCarreras()
    getSocialAreas()
    getPosts()
    getUser()
  },[])
  
  return (
    <div style={{display: "flex", justifyContent: "center"}}>
        <div className='createPost'>
            <Button variant="primary" className='FormButtonCrearPost' onClick={handleShow}>
                CREAR POST
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
        <Modal.Title>Nuevo Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className='SignUpModalBody'>
        <Form className='SignUpForm'>
            <Form.Group className="mb-3SingUp" controlId="formBasicTitle">
            <Form.Control className='formControlSignUp' type="text" placeholder="Título*" onChange={(value)=>handleTitle(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" style={{width:"50%"}} controlId="formBasicContent">
            <textarea className="formControlTextArea" rows="8" placeholder='Contenido*' onChange={(value)=>handleContent(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" controlId="formBasicUrlImage">
            <Form.Control className='formControlSignUp' type="text" placeholder="Url Imagen" onChange={(value)=>handleImgUrl(value)}/>
            </Form.Group>
            <Form.Group className="mb-3SingUp" controlId="formBasicCareer">
            <Form.Select className='formControlSignUpSelect' onChange={(value)=>handleCareer(value)}>
            <option>Carrera de interés*</option>
            <option value="0">Todas</option>
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
            <Form.Group className="mb-3SingUp" controlId="formBasicComment">
            <Form.Control className='formControlSignUp' type="text" placeholder="Comentario" onChange={(value)=>handleComment(value)}/>
            </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer className='signupfooter'>
        <Button variant="secondary" className='FormButtonPure' onClick={handleClose}>
            Cancelar
        </Button>
        <Button variant="primary" className='FormButtonPure addmarginleft' onClick={sendPost}>
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
            <Toast.Body>Post creado correctamente.</Toast.Body>
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
            <Toast.Body>Hubo un error al crear el Post.</Toast.Body>
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
                  <h5 style={{marginBottom:"1rem"}}>{post.titulo}</h5>
                </div>
                <div className='postCardInfo'>
                  <p className='postInfo'>{post.contenido}</p>
                </div>
                <div>
                  <img src={post.imgurl}
                  className='postImage'
                  />
                  <div style={{textAlign:"right"}}>
                    <h6 style={{color:"#0d6efd"}}>{post.nombreAreaSocial}</h6>
                    <h6 style={{marginLeft:"3rem", color:"#c0c0c0"}}>{post.nombreCarrera}</h6>
                  </div>
                </div>
              </div>
          </div>
          <div className="commentsWidget">
            <h6 style={{marginBottom:"2rem"}}>Deja tu comentario:</h6>
              <div>
                <Form id='commentForm' className='SignUpForm'>
                  <Form.Group className="mb-3SingUp" style={{width:"50%"}} controlId="formBasicContent">
                    <textarea defaultValue={''} className="formControlTextArea" rows="3" placeholder='Comentario:' onChange={(value)=>handlePostComment(value)}/>
                  </Form.Group>
                  <Form.Group className="FooterButtonsProfile" style={{marginTop:"1rem"}}>
                    <Button variant="primary" className='FormButtonProfile' style={{width:"100%"}} onClick={sendComment}>
                      Enviar Comentario
                    </Button>
                  </Form.Group>
                </Form>
              </div>
          </div>
          <div className="commentsWidget">
            <h6 style={{marginBottom:"2rem"}}>Comentarios:</h6>
            {comments.map((comment)=>(
              <div className='commentswl2'>
                <div className='commentStyle'>
                  <p className='commentslinkToUser'>{comment.nombre+' '+comment.apellidoPaterno+' '+comment.apellidoMaterno}</p>
                  <p  className='commentslinkToPost'>{comment.contenido}</p>
                  <p className='commentswp'>{comment.fecha.toString().slice(0,10)}</p>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className='signupfooter'>
        <Button variant="secondary" className='FormButtonPure' onClick={handleClose2}>
            Volver
        </Button>
        </Modal.Footer>

        <ToastContainer position="middle-center" className="p-3">
        <Toast onClose={() => setNoComment(false)} show={noComment} delay={2000} autohide>
            <Toast.Header>
            <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
            />
            <strong className="me-auto">ERROR</strong>
            </Toast.Header>
            <Toast.Body>Primero escribe un comentario *.</Toast.Body>
        </Toast>
        </ToastContainer>

        </Modal>
    </div>
  )
}
