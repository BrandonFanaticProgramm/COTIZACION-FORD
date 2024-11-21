//CONEXION CON LA BASE DE DATOS

const mysql = require('mysql');
const conexion = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'Ford_cotizaciones'
});
