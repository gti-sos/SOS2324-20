

let express = require("express");
let app = express();

let bodyParser = require("body-parser");

const API_BASE = '/api/v1/food-production';

var datos = [];

//API 

function API_FSP(app) {

    app.use(bodyParser.json());

    //POST 1
    app.post(API_BASE + "/", (req, res) => {
        let data = req.body;

        // Check if data has the expected properties
        if (!data || !data.Entity || !data.Year || !data.rice_production || !data.tomatoes_production || !data.tea_production || !data.potatoes_production
            || !data.cocoa_beans_production || !data.meat_chicken_production || !data.bananas_production) {
            // If data is missing or does not have expected properties, return 400 Bad Request
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        const datosEle = datos.some(j => j.Entity === data.Entity && j.Year === data.Year);

        if (datosEle) {
            // No se puede hacer un POST con un recurso que ya existe;
            // en el caso contrario se debe devolver el código 409
            res.sendStatus(409, "CONFLICT");
        } else {
            // Crea dato
            datos.push(data);
            res.sendStatus(201, "CREATED");
        }
    });

    /*
    app.post(API_BASE + "/", (req, res) => {
        let data = req.body;
        const datosEle = datos.some(j => j.Entity === data.Entity && j.Year === data.Year);
        if (datosEle) {
            //No se puede hacer un POST con un recurso que ya existe;
            //en el caso contrario se debe devolver el código 409
            res.sendStatus(409, "CONFLICT");
        } else if (!data || Object.keys(data).length === 0) {
            //Si se recibe un dato (JSON) que no tiene los 
            //campos esperados se debe devolver el código 400
            res.sendStatus(400, "BAD REQUEST");
        } else {
            //Crea dato
            datos.push(data);
            res.sendStatus(201, "CREATED");
        }
    });
    */
    //GET 1
    app.get(API_BASE + "/", (req, res) => {
        //lista con todos los datos
        res.send(JSON.stringify(datos,null,2));
        res.sendStatus(200, "OK");
    });

    //PUT 1
    app.put(API_BASE + "/", (req, res) => {

        //Si se intenta usar alguno de los métodos no permitidos 
        //por la tabla azul se debe devolver el código 405
        let data = req.body;
        res.sendStatus(405, "Method not allowed");
    });

    //DELETE 1
    app.delete(API_BASE + "/", (req, res) => {
        // Eliminar todos los datos
        datos.splice(0, datos.length); // Elimina todos los elementos del array
        res.sendStatus(200, "Delete all");
    });

    //El recurso debe contener una ruta /api/v1/FFFFF/loadInitialData 
    //que al hacer un GET cree 10 o más datos en el array de NodeJS si está vacío.
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        if (datos.length === 0) {
            let csv =
                [
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

                ]
            for (let i = 0; i < csv.length; i++) {
                datos.push(csv[i]);
            }
            res.sendStatus(201, "Data created");
        } else {
            res.send(JSON.stringify(datos))
            res.sendStatus(200, "OK");
        }

    });
    //POST 2
    app.post(API_BASE + "/:country", (req, res) => {
        const pais = req.params.country;
        let data = req.body;
        res.sendStatus(405, "Method Not Allowed");
    });

    //GET 2
    app.get(API_BASE + "/:country", (req, res) => {
        //filtramos 
        const pais = req.params.country;
        const datosPais = datos.filter(p => p.Entity === pais);

        if (datosPais.length > 0) {
            //muestra los datos ya filtrados
            res.send(JSON.stringify(datosPais))
            res.sendStatus(200, "OK");
        } else {
            //Si se intenta acceder a un recurso 
            //inexistente se debe devolver el código 404
            res.sendStatus(404, "Not Found");
        }
    });

    //PUT 2
    app.put(API_BASE + "/:country", (req, res) => {

        const pais = req.params.country;
        let data = req.body;
        let actualizado = false;

        for (let i = 0; i < datos.length; i++) {
            if (datos[i].Entity === pais) {
                datos[i] = data;
                actualizado = true;
                break;
            }
        }

        if (!actualizado) {
            res.sendStatus(404, "Not Found");
        } else {
            res.sendStatus(200, "OK");
        }
    });

    //DELETE 2
    app.delete(API_BASE + "/:country", (req, res) => {
        const pais = req.params.country;
        const nuevosDatos = datos.filter(entrada => entrada.Entity !== pais);

        if (nuevosDatos.length < datos.length) {
            //eliminar los datos del filtro
            datos = nuevosDatos;
            res.sendStatus(200, "OK");
        } else {
            //Si se intenta acceder a un recurso 
            //inexistente se debe devolver el código 404
            res.sendStatus(404, "Not Found");
        }

    });


    // //MANEJAR RUTAS QUE NO EXISTEN
    // app.use((req, res, next) => {
    //     res.status(404).send('Recurso no encontrado');
    // });

}

module.exports.fsp_v1 = API_FSP;
