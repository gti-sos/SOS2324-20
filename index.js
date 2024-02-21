let cool = require("cool-ascii-faces");
let express = require("express");
const path = require("path"); // Módulo para manejar rutas de archivos

let app = express();
const PORT = (process.env.PORT || 10000);

app.use("/",express.static("./public"));

app.get("/cool", (req,res)=>{
    res.send(`<html><body><h1>${cool()}</h1></body></html>`);
});

app.get("/samples/AFO", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "/index-afo.html"));
  });

app.listen(PORT,()=>{
    console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});

console.log(`Server initializing...`);