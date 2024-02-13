const fs = require('fs');
const csv = require('csv-parser');

// Nombre del archivo CSV
const archivoCSV = 'life_expectancy.csv';
const datosCSV = [];

// Crea un stream de lectura del archivo CSV
fs.createReadStream(archivoCSV)
  .pipe(csv())
  .on('data', (fila) => {
    datosCSV.push(fila);
  })
  .on('end', () => {
    console.log('Lectura del archivo CSV completada.');
    console.log('Datos CSV:', datosCSV.length);
    media_por_pais('life_expectancy','Spain', datosCSV);
  })
  .on('error', (error) => {
    console.error('Error al leer el archivo CSV:', error);
  });

  function media_por_pais(attribute_name, country, datos) {
    const datos_por_pais = datos.filter(fila => fila['country'] === country);
    const lista_datos_proc = datos_por_pais.map(fila => parseFloat(fila[attribute_name]));
    const suma = lista_datos_proc.reduce((total, numero) => total + numero, 0);
    const media = suma / lista_datos_proc.length;
    console.log("La media del atributo " + attribute_name + ' para el país ' + country + ' es: ' + media);
}