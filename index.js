import express  from "express";

const PORT = (process.env.PORT || 10000);

let app = express();
import dataStore from "nedb";
import {handler} from "./front/build/handler.js";
import cors from "cors";

let dbFood = new dataStore();  // Datos Fran
let dbFood2 = new dataStore();  // Datos Fran
let dbLifeExpectancy = new dataStore();  // Datos Alex
let dbLifeExpectancy2 = new dataStore();  // Datos Alex
let dbDrugs = new dataStore(); // Datos Rufino

import bodyParser from "body-parser";

import {API_FSP}  from "./back/api/food-production/index-FSP.js";
import { API_AFO } from "./back/api/life-expectancy/index-AFO.js";
import { API_RMP } from "./back/api/pharmaceutical-drugs-spending/index-RMP.js";
import { API_AFO_V2 } from "./back/api/life-expectancy/index-AFO-v2.js";
import { API_FSP_V2 } from "./back/api/food-production/index-FSP-v2.js";   


app.use(cors());
app.use(bodyParser.json());

API_FSP(app,dbFood);
API_AFO(app,dbLifeExpectancy);
API_RMP(app,dbDrugs);
API_AFO_V2(app,dbLifeExpectancy2);
API_FSP_V2(app,dbFood2);


app.use(handler);

app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});

console.log(`Server initializing...`);