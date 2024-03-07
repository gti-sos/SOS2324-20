

let express = require("express");
let app = express();

let bodyParser = require("body-parser");

const API_BASE = '/api/v1/food-production';

var initialData = [
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

];

//API 

function API_FSP(app, dbFood) {

    app.use(bodyParser.json());

    //GETs

    app.get(API_BASE + "/loadInitialData", (req, res) => {
        dbFood.find({}, (err, docs) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (docs.length == 0) {
                    dbFood.insert(initialData);
                    res.sendStatus(201, "Created");
                } else {
                    res.sendStatus(409, "Conflict");
                }
            }

        });

    });


    app.get(API_BASE + "/", (req, res) => {
        dbFood.find({}, (err, list) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                res.send(JSON.stringify(list.map((p) => {
                    delete p._id;
                    return p;
                })));
            }
        });
    });

    //busqueda por nombre de pais
    app.get(API_BASE + "/:country", (req, res) => {
        let pais = req.params.country;

        dbFood.findOne({ Entity: pais }, (err, searchedFood) => {
            if (searchedFood) {
                res.send(JSON.stringify(searchedFood));
            } else {
                res.sendStatus(404, "Country not Found");
            }
        });
    });

    //busqueda por año
    app.get(API_BASE + "/year/:year", (req, res) => {
        let year = parseInt(req.params.year);

        dbFood.findOne({ Year: year }, (err, searchedFood) => {
            if (searchedFood) {
                res.send(JSON.stringify(searchedFood));
            } else {
                res.sendStatus(404, "Year not Found");
            }
        });
    });

    // busqueda por rice_production
    app.get(API_BASE + "/rice_production/:rice_production", (req, res) => {
        let riceProduction = parseFloat(req.params.rice_production);

        dbFood.findOne({ rice_production: riceProduction }, (err, searchedFood) => {
            if (searchedFood) {
                res.send(JSON.stringify(searchedFood));
            } else {
                res.sendStatus(404, "Rice production not Found");
            }
        });
    });

    // busqueda por tomatoes_production
    app.get(API_BASE + "/tomatoes_production/:tomatoes_production", (req, res) => {
        let tomatoesProduction = parseFloat(req.params.tomatoes_production);

        dbFood.findOne({ tomatoes_production: tomatoesProduction }, (err, searchedFood) => {
            if (searchedFood) {
                res.send(JSON.stringify(searchedFood));
            } else {
                res.sendStatus(404, "Tomatoes production not Found");
            }
        });
    });

    // busqueda por tea_production
    app.get(API_BASE + "/tea_production/:tea_production", (req, res) => {
        let teaProduction = parseFloat(req.params.tea_production);

        dbFood.findOne({ tea_production: teaProduction }, (err, searchedFood) => {
            if (searchedFood) {
                res.send(JSON.stringify(searchedFood));
            } else {
                res.sendStatus(404, "Tea production not Found");
            }
        });
    });

    // busqueda por potatoes_production
    app.get(API_BASE + "/potatoes_production/:potatoes_production", (req, res) => {
        let potatoesProduction = parseFloat(req.params.potatoes_production);

        dbFood.findOne({ potatoes_production: potatoesProduction }, (err, searchedFood) => {
            if (searchedFood) {
                res.send(JSON.stringify(searchedFood));
            } else {
                res.sendStatus(404, "Potatoes production not Found");
            }
        });
    });

    // busqueda por cocoa_beans_production
    app.get(API_BASE + "/cocoa_beans_production/:cocoa_beans_production", (req, res) => {
        let cocoaBeansProduction = parseFloat(req.params.cocoa_beans_production);

        dbFood.findOne({ cocoa_beans_production: cocoaBeansProduction }, (err, searchedFood) => {
            if (searchedFood) {
                res.send(JSON.stringify(searchedFood));
            } else {
                res.sendStatus(404, "Cocoa beans production not Found");
            }
        });
    });

    // busqueda por meat_chicken_production
    app.get(API_BASE + "/meat_chicken_production/:meat_chicken_production", (req, res) => {
        let meatChickenProduction = parseFloat(req.params.meat_chicken_production);

        dbFood.findOne({ meat_chicken_production: meatChickenProduction }, (err, searchedFood) => {
            if (searchedFood) {
                res.send(JSON.stringify(searchedFood));
            } else {
                res.sendStatus(404, "Meat chicken production not Found");
            }
        });
    });

    // busqueda por bananas_production
    app.get(API_BASE + "/bananas_production/:bananas_production", (req, res) => {
        let bananasProduction = parseFloat(req.params.bananas_production);

        dbFood.findOne({ bananas_production: bananasProduction }, (err, searchedFood) => {
            if (searchedFood) {
                res.send(JSON.stringify(searchedFood));
            } else {
                res.sendStatus(404, "Bananas production not Found");
            }
        });
    });


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


    //POST 2
    app.post(API_BASE + "/:country", (req, res) => {
        const pais = req.params.country;
        let data = req.body;
        res.sendStatus(405, "Method Not Allowed");
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
