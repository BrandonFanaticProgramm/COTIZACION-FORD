//SERVER DONDE SE SERVIRAN TODOS LOS DATOS PARA SER INSERTADOS EN LA PAGINA PRINCIPAL
const conexion = require('./conexion');

conexion.query('SELECT * FROM Vehiculos', (err, results, fields) => {
    if (err) {
        console.error('Error al realizar la consulta:', err);
        return;
    }
    console.log('Resultados:', results[0].id_vehiculo);
    conexion.end();
});

const http = require('http');
const server = http.createServer((req,res) => {

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.status = 200;
    res.end();
});


const port = 5000;

server.listen(port,()=> {
    console.log(`Servidor en puerto ${port}`);
})