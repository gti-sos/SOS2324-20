let cool = require("cool-ascii-faces");
let express = require("express");
const path = require("path"); // Módulo para manejar rutas de archivos

const afo = require("./index-AFO");
const fsp = require("./index-FSP");
const rmp = require("./index-RMP");

let app = express();
const PORT = (process.env.PORT || 10000);

app.use("/", express.static("./public"));

app.get("/cool", (req, res) => {
  res.send(`<html><body><h1>${cool()}</h1></body></html>`);
});

app.get("/samples/AFO", (req, res) => {
  res.send(afo.media_por_pais_afo("electric_power_consumption", "bahrain", afo.data_afo))
});

app.get("/samples/FSP", (req, res) => {
  res.send(fsp.media_por_producto_fsp(fsp.data_fsp, "Afghanistan", "tomatoes_production"))
});

app.get("/samples/RMP", (req, res) => {
  res.send(rmp.media_por_pais_gasto_total_rmp(rmp.data_rmp, "AUS"))
});

app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});

console.log(`Server initializing...`);