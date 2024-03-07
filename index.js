let cool = require("cool-ascii-faces");
let express = require("express");
const path = require("path"); // Módulo para manejar rutas de archivos
const PORT = (process.env.PORT || 10000);

let dataStore = require("nedb");
let dbFood = new dataStore();  // Datos Fran

const afo = require("./index-AFO");

let data_FSP = require("./index-FSP");
let rmp = require("./index-RMP");
let bodyParser = require("body-parser");
let api_FSP = require("./api-food-production/index-FSP");
let api_AFO = require("./api/index-AFO");
let api_RMP = require("./api/index-RMP");

let app = express();

app.use(bodyParser.json());


const API_BASE = '/api/v1';

app.use("/", express.static("./public"));

//app.get("/samples/RMP", (req, res) => {
//  res.send(rmp.media_por_pais_gasto_total_rmp(rmp.data_rmp, "AUS"))
//});

//FSP

api_FSP.fsp_v1(app,dbFood);


api_AFO.afo_v1(app);
app.get("/samples/AFO", (req,res) =>{
    let pais ="bahrain"
    let type = "electric_power_consumption"

    res.send(afo.media_por_pais_afo(type, pais, afo.data_afo))
});

api_RMP.rmp_v1(app);
app.get("/samples/RMP", (req,res) =>{
    let pais ="AUS"

    res.send(rmp.media_por_pais_gasto_total_rmp(rmp.data_rmp, pais))
});




















app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});

console.log(`Server initializing...`);