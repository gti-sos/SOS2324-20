let express = require("express");
let app = express();
const PORT = (process.env.PORT || 10000);

let dataStore = require("nedb");
let dbFood = new dataStore();  // Datos Fran
let dbLifeExpectancy = new dataStore();  // Datos Alex
let dbDrugs = new dataStore(); // Datos Rufino

let bodyParser = require("body-parser");

let api_FSP = require("./api/food-production/index-FSP");
let api_AFO = require("./api/life-expectancy/index-AFO");
let api_RMP = require("./api/pharmaceutical-drugs-spending/index-RMP");

app.use(bodyParser.json());
app.use("/", express.static("./public"));

api_FSP.fsp_v1(app,dbFood);

api_AFO.afo_v1(app, dbLifeExpectancy);

api_RMP.rmp_v1(app, dbDrugs);


app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});

console.log(`Server initializing...`);