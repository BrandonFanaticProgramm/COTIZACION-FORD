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
const port = 3000;

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
        conexion.end();
    });

});

app.listen(port,()=> {
    console.log('escuchando en el puerto ', port);
})