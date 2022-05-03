const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'helpcuceidb'
});

const db2 = mysql.createPool({
    host: 'wb39lt71kvkgdmw0.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'item1z6pj06n4wle',
    password: 'i2hdaaf22omv7ssf',
    database: 'hsfrci7d1hukw93p'
});

app.use('/api/login', (req, res) => {
    const sqlStatement= "SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?;";
    db.query(sqlStatement, [req.body.username, req.body.password2], (err, result) =>{
        if(result.length>0){
            res.send({
                token: req.body.username,
          });
        }else{
            res.send(err);
        }
    });
});


app.get('/api/get', (req, res) =>{
    const sqlStatement= "SELECT * FROM usuarios";
    db.query(sqlStatement, (err, result) =>{
        res.send(result);
    });
});

app.get('/api/getuser', (req, res) =>{
    const sqlStatement= "SELECT * FROM usuarios WHERE correo = ?";
    db.query(sqlStatement, req.query.correo,(err, result) =>{
        res.send(result);
    });
});

app.get('/api/getfulluser', (req, res) =>{
    const sqlStatement= "SELECT U.id, U.nombre, U.apellidoPaterno, U.apellidoMaterno, U.correo, U.fechaIngreso, U.fechaNacimiento, U.idCarrera, C.nombre AS nombreCarrera FROM usuarios AS U INNER JOIN carreras AS C ON U.idCarrera = C.id WHERE correo = ?";
    db.query(sqlStatement, req.query.correo,(err, result) =>{
        res.send(result);
    });
});

app.get('/api/posts/get', (req, res) =>{
    const sqlStatement= "SELECT P.id, P.idUsuario, P.titulo, P.contenido, P.fecha, P.idAreaSocial, P.idCarrera, P.status, P.comentario, P.imgurl, P.estadoAprobacion, A.nombre AS nombreAreaSocial, C.nombre AS nombreCarrera FROM posts AS P INNER JOIN areassociales AS A ON P.idAreaSocial = A.id INNER JOIN carreras AS C ON P.idCarrera = C.id;";
    db.query(sqlStatement, (err, result) =>{
        res.send(result);
    });
});

app.get('/api/posts/categoryposts', (req, res) =>{
    const sqlStatement= "SELECT P.id, P.idUsuario, P.titulo, P.contenido, P.fecha, P.idAreaSocial, P.idCarrera, P.status, P.comentario, P.imgurl, P.estadoAprobacion, A.nombre AS nombreAreaSocial, C.nombre AS nombreCarrera FROM posts AS P INNER JOIN areassociales AS A ON P.idAreaSocial = A.id INNER JOIN carreras AS C ON P.idCarrera = C.id WHERE A.nombre = ?";
    db.query(sqlStatement, req.query.socialArea, (err, result) =>{
        res.send(result);
    });
});

app.get('/api/comments/get', (req, res) =>{
    const sqlStatement= "SELECT P.id, P.idUsuario, P.contenido, P.fecha, P.idPost, P.status, P.comentario, P.estadoAprobacion, A.nombre, A.apellidoPaterno, A.apellidoMaterno, A.correo FROM comentarios AS P INNER JOIN usuarios AS A ON P.idUsuario = A.id WHERE P.idPost = ?;";
    db.query(sqlStatement, parseInt(req.query.id), (err, result) =>{
        res.send(result);
    });
});

app.get('/api/comments/getall', (req, res) =>{
    const sqlStatement= "SELECT * FROM comentarios;";
    db.query(sqlStatement, parseInt(req.query.id), (err, result) =>{
        res.send(result);
    });
});

app.get('/api/news/get', (req, res) =>{
    const sqlStatement= "SELECT P.id, P.fechaInicio, P.fechaTermino, P.tema, P.prioridad, P.contenido, P.referencia, P.idAreaSocial, P.status, P.estadoAprobacion, P.imgurl, A.nombre AS nombreAreaSocial FROM informacion AS P INNER JOIN areassociales AS A ON P.idAreaSocial = A.id;";
    db.query(sqlStatement, (err, result) =>{
        res.send(result);
    });
});

app.get('/api/news/categorynew', (req, res) =>{
    const sqlStatement= "SELECT P.id, P.fechaInicio, P.fechaTermino, P.tema, P.prioridad, P.contenido, P.referencia, P.idAreaSocial, P.status, P.estadoAprobacion, P.imgurl, A.nombre AS nombreAreaSocial FROM informacion AS P INNER JOIN areassociales AS A ON P.idAreaSocial = A.id WHERE A.nombre = ?;";
    db.query(sqlStatement, req.query.socialArea,(err, result) =>{
        res.send(result);
    });
});

app.get('/api/carreras/get', (req, res) =>{
    const sqlStatement= "SELECT * FROM carreras";
    db.query(sqlStatement, (err, result) =>{
        res.send(result);
    });
});

app.get('/api/socialareas/get', (req, res) =>{
    const sqlStatement= "SELECT * FROM areassociales";
    db.query(sqlStatement, (err, result) =>{
        res.send(result);
    });
});

app.post('/api/insert', (req,res) => {
    try{
        const data ={
        nombre: req.body.name,
        apellidoP: req.body.lastName,
        apellidoM: req.body.secondLastName,
        fechaNacimiento: req.body.dateOfBirth,
        correo: req.body.email,
        contraseña: req.body.password,
        rol: req.body.rol,
        fechaIngreso: req.body.ingressDate,
        idCarrera: req.body.career,
        fechaRegistro: req.body.signUpDate
        }
        console.log("DATA: ",data);
        const sqlStatement = "INSERT INTO usuarios (nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, correo, contraseña, rol, fechaIngreso, fechaRegistro, idCarrera) VALUES (?,?,?,?,?,?,?,?,?,?);"
        db.query(sqlStatement, [data.nombre, data.apellidoP, data.apellidoM, data.fechaNacimiento, data.correo, data.contraseña, data.rol, data.fechaIngreso, data.fechaRegistro, data.idCarrera], (err, result) => {
            console.log('RES: ',result);
            console.log('ERR: ',err);
            res.send(result);
        });
    }catch{
        console.log("ERROR AL INSERTAR USUARIO");
    }
    
});

app.post('/api/posts/insert', (req,res) => {
    const sqlStatement = "INSERT INTO posts (idUsuario, titulo, contenido, fecha, idAreaSocial, idCarrera, comentario, imgurl, status, estadoAprobacion) VALUES (?,?,?,?,?,?,?,?,?,?);"
    db.query(sqlStatement, [req.body.idUsuario, req.body.titulo, req.body.contenido, req.body.fecha, req.body.areasocial, req.body.carrera, req.body.comentario, req.body.imgurl, req.body.status, req.body.estadoAprobacion], (err, result) => {
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});

app.post('/api/comments/insert', (req,res) => {
    const sqlStatement = "INSERT INTO comentarios (idUsuario, contenido, fecha, idPost, status, comentario, estadoAprobacion) VALUES (?,?,?,?,?,?,?);"
    db.query(sqlStatement, [req.body.idUsuario, req.body.contenido, req.body.fecha, req.body.idPost, req.body.status, req.body.comentario, req.body.estadoAprobacion], (err, result) => {
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});

app.post('/api/news/insert', (req,res) => {
    const sqlStatement = "INSERT INTO informacion (fechaInicio, fechaTermino, tema, prioridad, contenido, referencia, idAreaSocial, status, estadoAprobacion, imgurl) VALUES (?,?,?,?,?,?,?,?,?,?);"
    db.query(sqlStatement, [req.body.fechaInicio, req.body.fechaFin, req.body.tema, req.body.prioridad, req.body.contenido, req.body.referencia, req.body.areasocial, req.body.status, req.body.estadoAprobacion, req.body.imgurl], (err, result) => {
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});

app.put('/api/posts/update', (req,res) => {
    const sqlStatement = "UPDATE posts SET estadoAprobacion = ? WHERE id = ?;"
    db.query(sqlStatement, [req.body.estadoAprobacion, req.body.id], (err, result) => {
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});

app.put('/api/news/update', (req,res) => {
    const sqlStatement = "UPDATE informacion SET estadoAprobacion = ? WHERE id = ?;"
    db.query(sqlStatement, [req.body.estadoAprobacion, req.body.id], (err, result) => {
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});

app.put('/api/comment/update', (req,res) => {
    console.log("ea: ",req.body.estadoAprobacion);
    console.log("id: ",req.body.id);
    const sqlStatement = "UPDATE comentarios SET estadoAprobacion = ? WHERE id = ?;"
    db.query(sqlStatement, [req.body.estadoAprobacion, req.body.id], (err, result) => {
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});

app.put('/api/role/update', (req,res) => {
    const sqlStatement = "UPDATE usuarios SET rol = ? WHERE id = ?;"
    db.query(sqlStatement, [req.body.rol, req.body.id], (err, result) => {
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});

app.put('/api/user/update', (req,res) => {
    console.log("REQBODY: ",req.body);
    const sqlStatement = "UPDATE usuarios SET nombre = ?, apellidoPaterno = ?, apellidoMaterno = ?, correo = ?, fechaNacimiento = ?, fechaIngreso = ?, idCarrera = ? WHERE id = ?;"
    db.query(sqlStatement, [req.body.user.nombre, 
        req.body.user.apellidoPaterno, 
        req.body.user.apellidoMaterno, 
        req.body.user.correo,
        req.body.user.fechaNacimiento.slice(0,10),
        req.body.user.fechaIngreso,
        req.body.user.idCarrera,
        req.body.user.id], (err, result) => {
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});

app.put('/api/password/update', (req,res) => {
    console.log("REQBODY: ",req.body);
    const sqlStatement = "UPDATE usuarios SET contraseña = ? WHERE id = ?;"
    db.query(sqlStatement, [req.body.password, req.body.id], (err, result) => {
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});

app.get('/api/posts/countall', (req, res) =>{
    const sqlStatement= "SELECT COUNT(status) AS cantidad FROM posts WHERE status = 1;";
    db.query(sqlStatement, (err, result) =>{
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});
app.get('/api/news/countall', (req, res) =>{
    const sqlStatement= "SELECT COUNT(status) AS cantidad FROM informacion WHERE status = 1;";
    db.query(sqlStatement, (err, result) =>{
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});
app.get('/api/users/countall', (req, res) =>{
    const sqlStatement= "SELECT COUNT(status) AS cantidad FROM usuarios WHERE status = 1;";
    db.query(sqlStatement, (err, result) =>{
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});
app.get('/api/comments/countall', (req, res) =>{
    const sqlStatement= "SELECT COUNT(status) AS cantidad FROM comentarios WHERE status = 1;";
    db.query(sqlStatement, (err, result) =>{
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});
app.get('/api/posts/countone', (req, res) =>{
    const sqlStatement= "SELECT T1.cant AS cantp, T2.cant AS cantn FROM (SELECT COUNT(status) AS cant FROM posts WHERE idAreaSocial = ?) AS T1, (SELECT COUNT(status) AS cant FROM informacion WHERE idAreaSocial = ?) AS T2;";
    db.query(sqlStatement, [req.query.id, req.query.id], (err, result) =>{
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});
app.get('/api/news/countone', (req, res) =>{
    const sqlStatement= "SELECT COUNT(status) AS cantidad FROM informacion WHERE status = 1 AND idAreaSocial = ?;";
    db.query(sqlStatement, req.query.id, (err, result) =>{
        console.log('RES: ',result);
        console.log('ERR: ',err);
        res.send(result);
    });
});

app.listen(3001, () =>{
    console.log("running on port 3001");
});