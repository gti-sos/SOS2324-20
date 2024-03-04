let express = require("express");
let app = express();

let bodyParser = require("body-parser");

const API_BASE = '/api/v1/phamaceutical-drugs-spending';

var datos = [];

function API_RMP(app) {

    //get 
    app.get(API_BASE + "/", (req, res) => {
        res.send(JSON.stringify(datos));
        res.sendStatus(200, "OK");
    });

    //loadData
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        if (datos.length === 0) {
            let csv =
                [
                    { location: "AUS", time: 1971, pc_healthxp: 15.992, pc_gdp: 0.727, usd_cap: 35.72, total_spend: 462.11 },
                    { location: "AUS", time: 1972, pc_healthxp: 15.091, pc_gdp: 0.686, usd_cap: 36.056, total_spend: 475.11 },
                    { location: "AUS", time: 1973, pc_healthxp: 15.117, pc_gdp: 0.681, usd_cap: 39.871, total_spend: 533.47 },
                    { location: "AUS", time: 1974, pc_healthxp: 14.771, pc_gdp: 0.755, usd_cap: 47.559, total_spend: 652.65 },
                    { location: "AUS", time: 1975, pc_healthxp: 11.849, pc_gdp: 0.682, usd_cap: 47.561, total_spend: 660.76 },
                    { location: "AUS", time: 1976, pc_healthxp: 10.92, pc_gdp: 0.63, usd_cap: 46.908, total_spend: 658.26 },
                    { location: "AUS", time: 1977, pc_healthxp: 10.087, pc_gdp: 0.613, usd_cap: 47.649, total_spend: 676.23 },
                    { location: "AUS", time: 1978, pc_healthxp: 9.958, pc_gdp: 0.591, usd_cap: 50.799, total_spend: 729.37 },
                    { location: "AUS", time: 1979, pc_healthxp: 8.981, pc_gdp: 0.523, usd_cap: 49.766, total_spend: 722.3 },
                    { location: "AUS", time: 1980, pc_healthxp: 9.263, pc_gdp: 0.54, usd_cap: 56.972, total_spend: 837.03 },
                    { location: "RUS", time: 1980, pc_healthxp: 9.263, pc_gdp: 0.54, usd_cap: 56.972, total_spend: 837.03 },
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

    //post
    app.post(API_BASE + "/", (req, res) => {
        let data = req.body;
        const datosEle = datos.some(j => j.location === data.location && j.time === data.time);
        if (datosEle) {
            res.sendStatus(409, "CONFLICT");
        } else if (!data || Object.keys(data).length === 0) {
            res.sendStatus(400, "BAD REQUEST");
        } else {
            datos.push(data);
            res.sendStatus(201, "CREATED");
        }
    });

    //put
    app.put(API_BASE + "/", (req, res) => {
        res.sendStatus(405, "Method not allowed");
    });

    //delete
    app.delete(API_BASE + "/", (req, res) => {
        datos.splice(0, datos.length); // Elimina todos los elementos del array
        res.sendStatus(200, "Delete all");
    });
    //post 2
    app.post(API_BASE + "/:location", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });
    //get 2
    app.get(API_BASE + "/:location", (req, res) => {
        //filtramos 
        const pais = req.params.location;
        const datosPais = datos.filter(p => p.location === pais);

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

    //put 2
    app.put(API_BASE + "/:location", (req, res) => {

        const pais = req.params.location;
        let data = req.body;
        let actualizado = false;

        for (let i = 0; i < datos.length; i++) {
            if (datos[i].location === pais) {
                datos[i] = data;
                actualizado = true;
                break;
            }
        }

        if (!actualizado) {
            res.status(404).send("Not Found");
        } else {
            res.status(200).send("OK");
        }
    });
    
    //delete 
    app.delete(API_BASE + "/:location", (req, res) => {
        const pais = req.params.location;
        const nuevosDatos = datos.filter(entrada => entrada.location !== pais);

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




}



module.exports.rmp_v1 = API_RMP;
