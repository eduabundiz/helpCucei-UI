import React, { useEffect, useState } from 'react';
import {Modal, Table, Button, Popover} from 'antd';
import {notification} from 'antd';
import {useNavigate} from 'react-router-dom';
import 'antd/dist/antd.css';
import Axios from 'axios';
import { SERVICES_URL } from '../../utils/constants';

export default function Blog() {
    const [emptyCheck, setEmptyCheck] = useState(false);
    const [errorSignUp, setErrorSignUp] = useState(false);
    const [successSignUp, setSuccessSignUp] = useState(false);
    const navigate = useNavigate()
    const [modalVisualizar, setModalVisualizar] = useState(false);

    const [currentSocialAreaName, setCurrentSocialAreaName] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [socialAreas, setSocialAreas] = useState([]);
    const [carreras, setCarreas] = useState([]);
    const [post, setPost] = useState({});
    const [posts, setPosts] = useState([]);
    const [postData, setPostData] =useState({
        idUsuario: "1",
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

      const changePostStatus = (estado) =>{
        console.log("Estado: ",estado, " | ",post.id);
        try{
            Axios.put(SERVICES_URL+'/api/posts/update',{estadoAprobacion: estado, id: post.id}).then((response) => {
              console.log("status: ",response.data);
          });
          }catch{
            console.log("ERROR CHANGING STATUS")
          }
          setModalVisualizar(!modalVisualizar);
          getPosts();
          window.location.reload(true);
          notification.success({ message: 'Post aprobado'});
      }

  const CategoryWidget = () =>{
    return(
        <div className="categoryWidget">
          <h6 style={{marginBottom:"1rem"}}>Categorías:</h6>
          {socialAreas.map((sa)=>(
            <div className='cwl2'>
              <a  className='linkToCategory' href="">{sa.nombre}</a>
            </div>
          ))}
        </div>
    )
  }
  function getSocialAreas(){
    try{
      Axios.get(SERVICES_URL+'/api/socialareas/get').then((response) => {
      setSocialAreas(response.data);
      console.log("areas sociales: ",response.data);
    });
    }catch{
      console.log("ERROR GETTING SOCIAL AREAS")
    }
  }

  function getPosts(){
    try{
      Axios.get(SERVICES_URL+'/api/posts/get').then((response) => {
      console.log("GetPosts: ", response.data);
      const verifiedPosts = response.data.filter(post => post.estadoAprobacion === "PENDIENTE");
      if(verifiedPosts.length<=0){
        setPosts([{
          idUsuario: "1",
          titulo: "NO HAY PUBLICACIONES PENDIENTES",
          contenido: "En este momento no hay nuevas publicaciones pendientes por aprobar.",
          carrera: "",
          areasocial: "",
          comentario: "",
          imgurl: "",
          fecha: "",
          status: 1,
          estadoAprobacion: "PENDIENTE"
        }])
      }else{setPosts(verifiedPosts);}
    });
    }catch{
      console.log("ERROR GETTING POSTS")
    }
  }

  useEffect(() =>{
    getSocialAreas()
    getPosts()
  },[])
  
  const columnsPosts = [
    {
        title: "TÍTULO",
        dataIndex: "titulo",
        key: "titulo",
        className: "documents-column-css"
    },
    {
        title: "CARRERA",
        dataIndex: "nombreCarrera",
        key: "nombreCarrera",
        className: "documents-column-css textCenter"
    },
    {
        title: "ÁREA SOCIAL",
        dataIndex: "nombreAreaSocial",
        key: "nombreAreaSocial",
        className: "documents-column-css textCenter"
    },
    {
      title: "ACCIONES",
      key: "accion",
      className: "documents-column-css textCenter",
      render: (fila) => (
        <div>
          <Button type='primary' className='buttonVisualizar' onClick={()=>{setPost(fila) || setModalVisualizar(!modalVisualizar)}}>Revisar</Button>
        </div>
      )
    }
  ]

  return (
    <div style={{display: "flex", justifyContent: "center"}}>
      <style>{'body{background-color: rgb(219, 232, 255) !important;}'}</style>
        <div className='checkPostTableDiv'>
          <h4 style={{marginBottom: "2rem"}}>GESTIÓN DE PUBLICACIONES</h4>
          <Table className='checkPostTable' columns={columnsPosts} dataSource={posts} bordered={true}/>
        </div>
        <div className='recent'>
          <CategoryWidget/>
        </div>

        <Modal
              className="modalRevisar"
              width={800}
              visible={modalVisualizar}
              title={<label style={{ color: "black"}}>DETALLES DE LA PUBLICACIÓN</label>}
              onCancel={() =>{setModalVisualizar(!modalVisualizar)}}
              footer={[
                <Button type='primary' style={{width:"6rem"}} onClick={() => {setModalVisualizar(!modalVisualizar)}}>
                Cerrar
                </Button>,
                <Button type='primary' style={{width:"6rem"}} onClick={() => changePostStatus('APROBADO')}>
                Aprobar
                </Button>,
                <Button type='primary' danger style={{width:"6rem"}} onClick={() => changePostStatus('RECHAZADO')}>
                Rechazar
                </Button>
              ]}>
              <div className="postCard" style={{marginTop:"0"}}>
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
            </Modal>
    </div>
  )
}
