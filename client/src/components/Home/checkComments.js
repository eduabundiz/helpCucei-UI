import React, { useEffect, useState } from 'react';
import {Modal, Table, Button} from 'antd';
import {notification} from 'antd';
import 'antd/dist/antd.css';
import Axios from 'axios';
import { SERVICES_URL } from '../../utils/constants';

export default function CheckNews() {
    const [modalVisualizar, setModalVisualizar] = useState(false);
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);

    const changePostStatus = async (estado) =>{
        try{
            await Axios.put(/api/comment/update',{estadoAprobacion: estado, id: post.id}).then((response) => {
              getAllComments();
              notification.success({ message: 'Operación realizada con éxito'});
          });
          }catch{
            console.log("ERROR CHANGING STATUS")
          }
          setModalVisualizar(!modalVisualizar);
      }

  function getAllComments(){
    try{
      Axios.get(SERVICES_URL+'/api/comments/getall').then((response) => {
      const verifiedComments = response.data.filter(com => com.estadoAprobacion === "PENDIENTE");
      if(verifiedComments.length<=0){
        setComments([{
          contenido: "NO HAY ELEMENTOS PENDIENTES, INTENTE EN OTRO MOMENTO"
        }])
      }else{setComments(verifiedComments)}
    });
    }catch{
      console.log("ERROR GETTING POSTS")
    }
  }

  useEffect(() =>{
    getAllComments()
  },[])
  
  const columnsPosts = [
    {
        title: "COMENTARIO",
        dataIndex: "contenido",
        key: "contenido",
        className: "documents-column-css"
    },
    {
        title: "ESTADO",
        dataIndex: "estadoAprobacion",
        key: "estadoAprobacion",
        className: "documents-column-css textCenter"
    },
    {
      title: "ACCIONES",
      key: "accion",
      className: "documents-column-css textCenter",
      render: (fila) => (
        <div>
          <Button disabled={!fila.status} type='primary' className='buttonVisualizar' onClick={()=>{setPost(fila) || setModalVisualizar(!modalVisualizar)}}>Revisar</Button>
        </div>
      )
    }
  ]

  return (
    <div style={{display: "flex", justifyContent: "center"}}>
        <style>{'body{background-color: rgb(219, 232, 255) !important;}'}</style>
        <div className='checkPostTableDiv'>
        <h4 style={{marginBottom: "2rem"}}>GESTIÓN DE COMENTARIOS</h4>
          <Table className='checkPostTable' columns={columnsPosts} dataSource={comments} bordered={true}/>
        </div>

        <Modal
              className="modalRevisar"
              width={800}
              visible={modalVisualizar}
              title={<label style={{ color: "black"}}>DETALLES DE COMENTARIO</label>}
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
                        <h5 style={{marginBottom:"1rem"}}>{post.contenido}</h5>
                    </div>
                    </div>
                </div>
            </Modal>
    </div>
  )
}
