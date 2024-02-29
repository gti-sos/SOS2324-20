

const datos = [
    { Entity: "Afghanistan", Year: 1961, rice_production: 319000, tomatoes_production: 1873812, tea_production: 56315, potatoes_production: 130000, cocoa_beans_production: 835368, meat_chicken_production: 5600, bananas_production: 3139079 },
    { Entity: "Afghanistan", Year: 1962, rice_production: 319000, tomatoes_production: 2044797, tea_production: 61519, potatoes_production: 115000, cocoa_beans_production: 867170, meat_chicken_production: 6000, bananas_production: 3181580 },
    { Entity: "Afghanistan", Year: 1963, rice_production: 319000, tomatoes_production: 2096077, tea_production: 63596, potatoes_production: 122000, cocoa_beans_production: 922621, meat_chicken_production: 6160, bananas_production: 3304256 },
    { Entity: "Afghanistan", Year: 1964, rice_production: 380000, tomatoes_production: 2388264, tea_production: 66604, potatoes_production: 129000, cocoa_beans_production: 1190061, meat_chicken_production: 6400, bananas_production: 3392527 },
    { Entity: "Afghanistan", Year: 1965, rice_production: 380000, tomatoes_production: 2559608, tea_production: 72418, potatoes_production: 132000, cocoa_beans_production: 874245, meat_chicken_production: 6800, bananas_production: 3450849 },
    { Entity: "Afghanistan", Year: 1966, rice_production: 337000, tomatoes_production: 2690984, tea_production: 90272, potatoes_production: 136000, cocoa_beans_production: 969648, meat_chicken_production: 7200, bananas_production: 3563461 },
    { Entity: "Afghanistan", Year: 1967, rice_production: 396000, tomatoes_production: 2580187, tea_production: 86111, potatoes_production: 147000, cocoa_beans_production: 982906, meat_chicken_production: 7600, bananas_production: 3603535 },
    { Entity: "Afghanistan", Year: 1968, rice_production: 402000, tomatoes_production: 2799236, tea_production: 100736, potatoes_production: 150000, cocoa_beans_production: 855617, meat_chicken_production: 8000, bananas_production: 3732902 },
    { Entity: "Afghanistan", Year: 1969, rice_production: 407000, tomatoes_production: 3001560, tea_production: 114363, potatoes_production: 154000, cocoa_beans_production: 1004663, meat_chicken_production: 9600, bananas_production: 3914729 },
    { Entity: "Afghanistan", Year: 1970, rice_production: 366000, tomatoes_production: 3111482, tea_production: 121398, potatoes_production: 144000, cocoa_beans_production: 1120835, meat_chicken_production: 9600, bananas_production: 4076156 }
    // Puedes añadir más filas según sea necesario
  ];


  function calcularMediaPorProducto(data, pais, producto) {
    // Filtra las filas para obtener solo las del país especificado
    const filasPais = data.filter(row => row.Entity === pais); 
    // Calcula la media del producto en el país especificado
    const totalProducto = filasPais.reduce((sum, row) => sum + row[producto], 0);   //suma acumulativa de los valores del atributo especificado
    const mediaProducto = totalProducto / filasPais.length;
  
    //const resultado_hmtl=`La media de ${producto} producidos en ${pais} es: ${mediaProducto}`;
    return  `La media de ${producto} producidos en ${pais} es: ${mediaProducto}`
  }


module.exports.media_por_producto_fsp = calcularMediaPorProducto;
module.exports.datos_fsp= datos;