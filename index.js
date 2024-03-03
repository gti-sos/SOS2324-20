let cool = require("cool-ascii-faces");
let express = require("express");
const path = require("path"); // Módulo para manejar rutas de archivos

const afo = require("./index-AFO");
let data_FSP = require("./index-FSP");
const rmp = require("./index-RMP");

let api_FSP = require("./api/index-FSP");
let api_AFO = require("./api/index-AFO");

let app = express();

const PORT = (process.env.PORT || 10000);
const API_BASE = '/api/v1';

app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});

console.log(`Server initializing...`);

app.use("/", express.static("./public"));

app.get("/cool", (req, res) => {
  res.send(`<html><body><h1>${cool()}</h1></body></html>`);
});


//AFO

// app.get("/samples/AFO", (req, res) => {
//   res.send(afo.media_por_pais_afo("electric_power_consumption", "bahrain", afo.data_afo))
// });



app.get("/samples/RMP", (req, res) => {
  res.send(rmp.media_por_pais_gasto_total_rmp(rmp.data_rmp, "AUS"))
});

//FSP

/*
app.get("/samples/FSP", (req, res) => {
  res.send(data_FSP.media_por_producto_fsp(data_FSP, "Afghanistan", "tomatoes_production"))
});
*/

api_FSP.fsp_v1(app);
app.get("/samples/FSP", (req,res) =>{
    let pais ="Afghanistan"
    let producto = "tomatoes_production"

    res.send(data_FSP.media_por_producto_fsp(data_FSP.datos_fsp, pais,producto))
});


api_AFO.afo_v1(app);
app.get("/samples/AFO", (req,res) =>{
    let pais ="bahrain"
    let type = "electric_power_consumption"

    res.send(afo.media_por_pais_afo(type, pais, afo.data_afo))
});