import React, { useEffect, useState } from 'react';
import {Modal, Table, Button} from 'antd';
import {notification} from 'antd';
import {useNavigate} from 'react-router-dom';
import 'antd/dist/antd.css';
import Axios from 'axios';
import { SERVICES_URL } from '../../utils/constants';

export default function CheckNews() {
    const [modalVisualizar, setModalVisualizar] = useState(false);
    const [post, setPost] = useState({});
    const [posts, setPosts] = useState([]);
    const [socialAreas, setSocialAreas] = useState([]);

      const changePostStatus = (estado) =>{
        console.log("Estado: ",estado, " | ",post.id);
        try{
            Axios.put(SERVICES_URL+'/api/news/update',{estadoAprobacion: estado, id: post.id}).then((response) => {
              console.log("status: ",response.data);
          });
          }catch{
            console.log("ERROR CHANGING STATUS")
          }
          setModalVisualizar(!modalVisualizar);
          getPosts();
          window.location.reload(true);
          notification.success({ message: 'Noticia aprobada'});
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

  function getPosts(){
    try{
      Axios.get(SERVICES_URL+'/api/news/get').then((response) => {
      console.log("GetPosts: ", response.data);
      const verifiedPosts = response.data.filter(post => post.estadoAprobacion === "PENDIENTE");
      if(verifiedPosts.length<=0){
        setPosts([{
          tema: "NO HAY NOTICIAS PENDIENTES",
          contenido: "En este momento no hay nuevas noticias pendientes por aprobar.",
          fechaInicio: "",
          fechaFin: "",
          prioridad: 1,
          referencia: "",
          areasocial: "",
          imgurl: "",
          status: 1,
          estadoAprobacion: "PENDIENTE"
        }])
      }else{setPosts(verifiedPosts);}
    });
    }catch{
      console.log("ERROR GETTING POSTS")
    }
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

  useEffect(() =>{
    getSocialAreas()
    getPosts()
  },[])
  
  const columnsPosts = [
    {
        title: "TÍTULO",
        dataIndex: "tema",
        key: "tema",
        className: "documents-column-css"
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
        <h4 style={{marginBottom: "2rem"}}>GESTIÓN DE NOTICIAS</h4>
          <Table className='checkPostTable' columns={columnsPosts} dataSource={posts} bordered={true}/>
        </div>
        <div className='recent'>
          <CategoryWidget/>
        </div>

        <Modal
              className="modalRevisar"
              width={800}
              visible={modalVisualizar}
              title={<label style={{ color: "black"}}>DETALLES DE LA NOTICIA</label>}
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
            </Modal>
    </div>
  )
}
