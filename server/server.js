const { createPdf } = require("./pdf.js");
const path = require("path");
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, port } = require("./config.js");
const mysql = require("mysql2/promise");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

let id_usuario = "";

// Crear la conexión utilizando Promesas
async function conexion() {
  const conexion = await mysql.createConnection({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
  });

  return conexion;
}

// Usamos la conexión correctamente en cada ruta, asegurándonos de esperar la conexión.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/vehiculos", async (req, res) => {
  try {
    const conn = await conexion(); // Espera la conexión
    const [results] = await conn.execute("SELECT id_vehiculo, nombre FROM Vehiculos");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error al realizar la consulta:", err);
    res.status(500).send("Error en el servidor");
  }
});

app.get("/ciudades", async (req, res) => {
  try {
    const conn = await conexion(); // Espera la conexión
    const [results] = await conn.execute("SELECT id_ciudad, nombre FROM Ciudad");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error al realizar la consulta:", err);
    res.status(500).send("Error en el servidor");
  }
});

app.get("/concesionarios", async (req, res) => {
  try {
    const conn = await conexion(); // Espera la conexión
    const [results] = await conn.execute("SELECT id_concesionario, nombre FROM Concesionario");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error al realizar la consulta:", err);
    res.status(500).send("Error en el servidor");
  }
});

app.post("/datos_usuarios", async (req, res) => {
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

  const query = `INSERT INTO Usuarios(nombre_usuario, apellido_usuario, email_usuario, telefono, id_ciudad, id_concesionario, id_vehiculo)
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

  try {
    const conn = await conexion(); // Espera la conexión
    const [result] = await conn.execute(query, values);
    id_usuario = result.insertId;

    const queryCotizacion = `INSERT INTO Cotizacion(id_usuario, fecha_cotizacion) VALUES (?, NOW())`;
    await conn.execute(queryCotizacion, [id_usuario]);

    res.status(200).send(result);
  } catch (err) {
    console.error("Error al insertar los datos:", err);
    res.status(500).send("Error al insertar datos");
  }
});

app.get("/cotizacion/:id_usuario", async (req, res) => {
  const id_usuario = req.params.id_usuario;
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
  `;

  try {
    const conn = await conexion(); // Espera la conexión
    const [results] = await conn.execute(queryData, [id_usuario]);
    createPdf(
      results,
      (data) => {
        stream.write(data); // Escribe el contenido PDF al stream
      },
      () => {
        stream.end(); // Cierra el stream después de que el PDF se haya generado
      }
    );
  } catch (err) {
    console.error("Error al generar el PDF:", err);
    res.status(500).send("Error al generar el PDF");
  }
});

app.listen(port, () => {
  console.log("escuchando en el puerto ", port);
});
