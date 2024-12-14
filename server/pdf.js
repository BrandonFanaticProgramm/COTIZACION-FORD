const PDFDocument = require('pdfkit');
const doc = new PDFDocument();
const axios = require('axios');
const imgUrl = 'https://i.ibb.co/0sDcTQ3/logoford.png'
async function createPdf(data, dataCallback, endCallback) {
  // Comprobamos si los datos no están vacíos
  const response = await axios({
    url: imgUrl,
    method: 'GET',
    responseType: 'arraybuffer'
  });

  const imgBuffer = Buffer.from(response.data);
  if (!data || data.length === 0) {
    console.error('No se encontraron datos para crear el PDF');
    return;
  }

  // Obtener el primer resultado (o el adecuado si es necesario)
  const cotizacion = data[0];

  // Escuchar el evento de datos
  doc.on('data', dataCallback);

  // Finalizar el flujo del PDF
  doc.on('end', endCallback);

  // Insertar la imagen del logo
  doc.image(imgBuffer, 20, 10, { width: 300 });

  // Centrado de texto
  const centerText = (text, yPosition) => {
    doc.fontSize(16).text(text, doc.page.width / 2 - doc.widthOfString(text) / 2, yPosition);
  };

  // Título de la cotización
  centerText('COTIZACIÓN DE VEHÍCULO', 80);

  // Detalles de la cotización
  doc.fontSize(12).text(`ID de Cotización: ${cotizacion.id_cotizacion}`, 40, 120);
  doc.text(`Fecha de Cotización: ${cotizacion.fecha_cotizacion}`, 40, 140);
  
  // Información del cliente (centrado)
  centerText('Cliente', 180);
  doc.fontSize(12).text(`Nombre: ${cotizacion.nombre_usuario} ${cotizacion.apellido_usuario}`, 40, 200);
  doc.text(`Email: ${cotizacion.email_usuario}`, 40, 220);
  doc.text(`Teléfono: ${cotizacion.telefono}`, 40, 240);
  
  // Información del concesionario (centrado)
  centerText('Concesionario', 280);
  doc.fontSize(12).text(`Nombre: ${cotizacion.concesionario}`, 40, 300);
  doc.text(`Dirección: ${cotizacion.direccion}`, 40, 320);
  doc.text(`Teléfono: ${cotizacion.telefono_concesionario}`, 40, 340);

  // Información del vehículo (centrado)
  centerText('Vehículo', 380);
  doc.fontSize(12).text(`Modelo: ${cotizacion.modelo}`, 40, 400);
  doc.text(`Tipo: ${cotizacion.tipo}`, 40, 420);
  doc.text(`Precio: ${cotizacion.precio}$`, 40, 440);
  doc.text(`Descripción: ${cotizacion.descripcion}`, 40, 460);

  // Finalización del documento PDF
  doc.end();
}

module.exports = { createPdf };
