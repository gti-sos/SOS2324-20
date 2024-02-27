

let express = require("express");
let app = express();

let bodyParser = require("body-parser");
app.use(bodyParser.json());

const data_fsp = require('./index-FSP');

//API 
function loadAPI_FSP(app) {
    app.get(API_BASE + "/total-food", (req, res) => {
        res.send(`<html><body><h1></h1></body></html>`);
    });

    app.get(API_BASE + "/total-food/loadInitialData", (req, res) => {
        res.send(JSON.stringify(data_fsp));
    });

    app.post(API_BASE + "/total-food", (req, res) => {
        let food = req.body;
        data_fsp.push(food);
        res.sendStatus(201, "Created");
    });

    app.delete(API_BASE + "/total-food/loadInitialData", (req, res) => {
        // Lógica para eliminar los datos_FSP, por ejemplo:
        data_fsp.splice(0, data_fsp.length); // Elimina todos los elementos del array
        res.status(200).send({ message: `Deleted total food` });
    });

};

export {loadAPI_FSP}

