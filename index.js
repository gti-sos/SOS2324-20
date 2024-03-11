let express = require("express");
const PORT = (process.env.PORT || 10000);

let dataStore = require("nedb");
let dbFood = new dataStore();  // Datos Fran
let dbLifeExpectancy = new dataStore();  // Datos Alex


let rmp = require("./index-RMP");

let bodyParser = require("body-parser");

let api_FSP = require("./api-food-production/index-FSP");
let api_AFO = require("./api-life-expectancy/index-AFO");
let api_RMP = require("./api/index-RMP");

let app = express();

app.use(bodyParser.json());
app.use("/", express.static("./public"));


//FSP

api_FSP.fsp_v1(app,dbFood);

api_AFO.afo_v1(app, dbLifeExpectancy);

api_RMP.rmp_v1(app);
app.get("/samples/RMP", (req,res) =>{
    let pais ="AUS"

    res.send(rmp.media_por_pais_gasto_total_rmp(rmp.data_rmp, pais))
});




















app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});

console.log(`Server initializing...`);