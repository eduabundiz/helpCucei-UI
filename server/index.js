const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

const db = mysql.createPool({
    host: '34.136.248.183',
    user: 'root',
    password: '123456',
    database: 'helpcucei'
});

/*
app.get('/', (req, res) =>{
    const sqlStatement = "INSERT INTO carreras (nombre) VALUES ('Ingeniería Robótica');"
    db.query(sqlStatement, (err, result) => {
        res.send("HELLO WORLD, SERVER LISTENING");
    })
});
*/
app.get('/api/get', (req, res) =>{
    const sqlStatement= "SELECT * FROM usuarios";
    db.query(sqlStatement, (err, result) =>{
        console.log("RESULT: ",result);
        res.send(result);
    });
});

app.post('/api/insert', (req,res) => {
    console.log("REQ: ",req.body);
    const data ={
        nombre: req.body.name,
        apellidoP: req.body.lastName,
        apellidoM: req.body.secondLastName,
        fechaNacimiento: req.body.dateOfBirth,
        correo: req.body.email,
        contraseña: req.body.password,
        rol: req.body.rol,
        fechaIngreso: req.body.ingressDate,
        idCarrera: req.body.career
    }
    console.log("DATA: ",data);
    const sqlStatement = "INSERT INTO usuarios (nombre, apellidoP, apellidoM, fechaNacimiento, correo, contraseña, rol, fechaIngreso, idCarrera) VALUES (?,?,?,?,?,?,?,?,?);"
    db.query(sqlStatement, [data.nombre, data.apellidoP, data.apellidoM, data.fechaNacimiento, data.correo, data.contraseña, data.rol, data.fechaIngreso, data.idCarrera], (err, result) => {
        console.log(err);
    });
});

app.listen(3001, () =>{
    console.log("running on port 3001");
});