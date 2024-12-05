//SERVER DONDE SE SERVIRAN TODOS LOS DATOS PARA SER INSERTADOS EN LA PAGINA PRINCIPAL

const mysql = require('mysql');
const conexion = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'Ford_cotizaciones'
});

const express = require('express');
const app = express();
const cors = require('cors')
const port = 5000;
app.use(cors());
app.use(express.json());

conexion.connect(err => {
    if(err) console.log('Error');
    console.log('Conectado')
})

app.get('/vehiculos',(req,res) => {
    conexion.query('SELECT id_vehiculo,nombre FROM Vehiculos', (err, results, fields) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            return;
        }

        res.status(200).json(results);
    });

});

app.get('/ciudades',(req,res) => {
    conexion.query('SELECT id_ciudad,nombre FROM Ciudad',(err,results,fields) => {
        if(err) throw err;
        res.status(200).json(results);
    })
})

app.get('/concesionarios', (req,res) => {
    conexion.query('SELECT id_concesionario,nombre FROM Concesionario',(err,results,fields) => {
        if(err) throw err;
        res.status(200).json(results);
    })
});

app.post('/datos_usuarios',(req,res) => {
    const datos = req.body
    const {nombre,apellido,email,telefono,concesionarioSeleccionado,ciudadSeleccionada,vehiculoSeleccionado} = datos;
    const query = `INSERT INTO Usuarios(nombre_usuario, apellido_usuario,email_usuario,telefono,id_ciudad,id_concesionario,id_vehiculo)
    VALUES(?,?,?,?,?,?,?)`;
    const values = [nombre, apellido, email, telefono, ciudadSeleccionada, concesionarioSeleccionado,vehiculoSeleccionado];
    conexion.query(query,values,(err,result) => {
        if(err) throw err
        console.log(`Datos insertados ${result}`);
        res.status(200).send(result);
    })


    
})

app.listen(port,()=> {
    console.log('escuchando en el puerto ', port);
})