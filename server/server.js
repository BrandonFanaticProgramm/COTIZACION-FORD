//SERVER DONDE SE SERVIRAN TODOS LOS DATOS PARA SER INSERTADOS EN LA PAGINA PRINCIPAL
const { createPdf } = require("./pdf.js");
const path = require('path');
const {DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  port,} = require('./config.js');
const mysql = require("mysql");
const conexion = mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')))
let id_usuario = "";

conexion.connect((err) => {
  if (err) console.log("Error");
  console.log("Conectado");
});

app.get('/',(req,res) => {
  res.sendFile(path.join(__dirname,'../public','index.html'));
})

app.get("/vehiculos", (req, res) => {
  conexion.query(
    "SELECT id_vehiculo,nombre FROM Vehiculos",
    (err, results, fields) => {
      if (err) {
        console.error("Error al realizar la consulta:", err);
        return;
      }

      res.status(200).json(results);
    }
  );
});

app.get("/ciudades", (req, res) => {
  conexion.query(
    "SELECT id_ciudad,nombre FROM Ciudad",
    (err, results, fields) => {
      if (err) throw err;
      res.status(200).json(results);
    }
  );
});

app.get("/concesionarios", (req, res) => {
  conexion.query(
    "SELECT id_concesionario,nombre FROM Concesionario",
    (err, results, fields) => {
      if (err) throw err;
      res.status(200).json(results);
    }
  );
});

app.post("/datos_usuarios", (req, res) => {
  const datos = req.body;
  const {
    nombre,
    apellido,
    email,
    telefono,
    concesionarioSeleccionado,
    ciudadSeleccionada,
    vehiculoSeleccionado,
  } = datos;
  const query = `INSERT INTO Usuarios(nombre_usuario, apellido_usuario,email_usuario,telefono,id_ciudad,id_concesionario,id_vehiculo)
    VALUES(?,?,?,?,?,?,?)`;
  const values = [
    nombre,
    apellido,
    email,
    telefono,
    ciudadSeleccionada,
    concesionarioSeleccionado,
    vehiculoSeleccionado,
  ];
  conexion.query(query, values, (err, result) => {
    id_usuario = result.insertId;
    if (err) throw err;
    res.status(200).send(result);
    const queryCotizacion = `INSERT INTO Cotizacion(id_usuario,fecha_cotizacion) VALUES (?,NOW())`;
    const valuesCotizacion = id_usuario;
    conexion.query(queryCotizacion, valuesCotizacion, (err, result) => {
      if (err) throw err;
    });
  });
});

app.get("/cotizacion/:id_usuario", (req, res) => {
  id_usuario = req.params.id_usuario;
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=cotizacion.pdf",
  });

  const queryData = `
    SELECT 
  Cotizacion.id_cotizacion,
  Cotizacion.fecha_cotizacion, 
  Usuarios.id_usuario,
  Usuarios.nombre_usuario,
  Usuarios.apellido_usuario,
  Usuarios.email_usuario,
  Usuarios.telefono,
  Ciudad.nombre AS ciudad,
  Concesionario.nombre AS concesionario,
  Concesionario.direccion,
  Concesionario.telefono AS telefono_concesionario,
  Vehiculos.nombre AS vehiculo,
  Vehiculos.modelo,
  Vehiculos.precio,
  Vehiculos.tipo,
  Vehiculos.descripcion
FROM Cotizacion
JOIN Usuarios ON Cotizacion.id_usuario = Usuarios.id_usuario AND Usuarios.id_usuario = ?
JOIN Ciudad ON Usuarios.id_ciudad = Ciudad.id_ciudad
JOIN Concesionario ON Usuarios.id_concesionario = Concesionario.id_concesionario
JOIN Vehiculos ON Usuarios.id_vehiculo = Vehiculos.id_vehiculo;
`

  conexion.query(queryData,[id_usuario],(err, results, fields) => {
      if (err) throw err;
      createPdf(results,(data) => {
          stream.write(data);
        },
        () => stream.end()
      );
    }
  );

});

app.listen(port, () => {
  console.log("escuchando en el puerto ", port);
});
