import React, { useEffect, useState } from 'react';
import {Modal, Table, Button} from 'antd';
import {notification} from 'antd';
import 'antd/dist/antd.css';
import Axios from 'axios';
import { PieChart } from 'react-minimal-pie-chart';

export default function Statistics() {
    const [modalVisualizar, setModalVisualizar] = useState(false);
    const [post, setPost] = useState({});
    const [socialAreas, setSocialAreas] = useState([]);
    const [nodata, setnodata] = useState(true);

    const [genPost, setGenPost] = useState({titulo: "PUBLICACIONES", cantidad: 0});
    const [genNews, setGenNews] = useState({titulo: "NOTICIAS", cantidad: 0});
    const [genUsers, setGenUsers] = useState({titulo: "USUARIOS", cantidad: 0});
    const [genComments, setGenComments] = useState({titulo: "COMENTARIOS", cantidad: 0});
    const [datap, setdatap] = useState(0)
    const [datan, setdatan] = useState(0)
    const [datapie, setdatapie] = useState([
        { title: 'Publicaciones', value: datap, color: '#007bff' },
        { title: 'Noticias', value: datan, color: '#ffc107' }
    ]);

      const CategoryWidget = () =>{
        return(
            <div className="categoryWidget">
              <h6 style={{marginBottom:"1rem"}}>Categorías:</h6>
              <Button className='postcategorybutton'>* Todas</Button>
              {socialAreas.map((sa)=>(
                <div className='cwl2'>
                  <Button className='postcategorybutton' onClick={() => {checkCount(sa.id) || setModalVisualizar(!modalVisualizar)}}>{sa.nombre}</Button>
                </div>
              ))}
            </div>
        )
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

      function checkCount(id){
          let cantp = 1;
          let cantn = 1;
          try{
            Axios.get('http://localhost:3001/api/posts/countone',{params: {id:id}}).then((response) => {
                console.log("postcount: ",response.data);
                if(response.data[0].cantp === 0 && response.data[0].cantn === 0){
                    setdatapie([{ title: 'Publicaciones', value: cantp, color: '#007bff' },
                { title: 'Noticias', value: cantn, color: '#ffc107' }]);
                }else{
                setdatapie([{ title: 'Publicaciones', value: response.data[0].cantp, color: '#007bff' },
                { title: 'Noticias', value: response.data[0].cantn, color: '#ffc107' }]);}
            });
          }catch{
            console.log("COUNT ERROR")
          }
      }

  function countPost(){
      try{
        Axios.get('http://localhost:3001/api/posts/countall').then((response) => {
            setGenPost({titulo: "PUBLICACIONES", cantidad: response.data[0].cantidad});
        });
      }catch{
        console.log("COUNT ERROR")
      }
  }
  function countNews(){
    try{
      Axios.get('http://localhost:3001/api/news/countall').then((response) => {
          setGenNews({titulo: "NOTICIAS", cantidad: response.data[0].cantidad});
      });
    }catch{
      console.log("COUNT ERROR")
    }
}
function countUsers(){
    try{
      Axios.get('http://localhost:3001/api/users/countall').then((response) => {
          setGenUsers({titulo: "USUARIOS", cantidad: response.data[0].cantidad});
      });
    }catch{
      console.log("COUNT ERROR")
    }
}
function countComments(){
    try{
      Axios.get('http://localhost:3001/api/comments/countall').then((response) => {
          setGenComments({titulo: "COMENTARIOS", cantidad: response.data[0].cantidad});
      });
    }catch{
      console.log("COUNT ERROR")
    }
}

  useEffect(() =>{
      countPost();
      countNews();
      countUsers();
      countComments();
      getSocialAreas();
  },[])
  
  const columnsPosts = [
    {
        title: "ELEMENTO",
        dataIndex: "titulo",
        key: "titulo",
        className: "documents-column-css"
    },
    {
        title: "CANTIDAD",
        dataIndex: "cantidad",
        key: "cantidad",
        className: "documents-column-css"
    }
  ]

  return (
    <div style={{display: "flex", justifyContent: "center"}}>
        <style>{'body{background-color: rgb(219, 232, 255) !important;}'}</style>
        <div className='checkPostTableDiv'>
        <h4 style={{marginBottom: "2rem"}}>DATOS GENERALES</h4>
          <Table className='checkPostTable' columns={columnsPosts} dataSource={[genPost,genNews,genUsers,genComments]} bordered={true} pagination={false}/>
          
        </div>
        <div className='recent'>
          <CategoryWidget/>
        </div>

        <Modal
              className="modalRevisar"
              width={500}
              centered
              visible={modalVisualizar}
              title={<label style={{ color: "black"}}>DETALLES</label>}
              onCancel={() =>{setModalVisualizar(!modalVisualizar)}}
              footer={[
                <Button type='primary' style={{width:"6rem"}} onClick={() => {setModalVisualizar(!modalVisualizar)}}>
                Cerrar
                </Button>,
              ]}>
                <div className='graphDiv'>
                <PieChart
                data={datapie}
                label={(data)=>data.dataEntry.title}
                labelStyle={{
                    fontSize: "5px"
                  }}

                />
                </div>
            </Modal>
    </div>
  )
}
