import express  from "express";

const PORT = (process.env.PORT || 10000);

let app = express();
import dataStore from "nedb";
import {handler} from "./front/build/handler.js";

let dbFood = new dataStore();  // Datos Fran
let dbLifeExpectancy = new dataStore();  // Datos Alex
let dbDrugs = new dataStore(); // Datos Rufino

import bodyParser from "body-parser";

import {API_FSP}  from "./api/food-production/index-FSP.js";
//let api_AFO = require("./api/life-expectancy/index-AFO");
//let api_RMP = require("./api/pharmaceutical-drugs-spending/index-RMP");

app.use(bodyParser.json());
app.use("/", express.static("./public"));
app.use(handler);

API_FSP(app,dbFood);

api_AFO.afo_v1(app, dbLifeExpectancy);

api_RMP.rmp_v1(app, dbDrugs);


app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});

console.log(`Server initializing...`);