const PDFDocument = require('pdfkit');
const doc = new PDFDocument;
const fs = require('fs')

function createPdf(){
    doc.text('Hola Soy la cotizacion',30,30);
    doc.pipe(fs.createReadStream('path: cotizacion.pdf'));
    doc.end();
}