let express = require("express");
let app = express();

let bodyParser = require("body-parser");

const API_BASE = '/api/v1/phamaceutical-drugs-spending';

var initialData = [
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

function validarDatos(req, res, next) {
    const json = req.body;

    const esquema = {
        'location': 'string',
        'time': 'number',
        'pc_healthxp': 'number',
        'pc_gdp': 'number',
        'usd_cap': 'number',
        'total_spend': 'number'
    };
    const receivedKeys = Object.keys(json);
    const expectedKeys = Object.keys(esquema);
    const missingKeys = expectedKeys.filter(key => !receivedKeys.includes(key));
    const extraKeys = receivedKeys.filter(key => !expectedKeys.includes(key));
    if (extraKeys.length > 0) {
        console.error(`There are more keys than expected: ${extraKeys.join(', ')}`);
        return res.sendStatus(400, "Bad request");
    }

    if (missingKeys.length > 0) {
        console.error(`There are missing keys: ${missingKeys.join(', ')}`);
        return res.sendStatus(400, "Bad request");
    }

    const erroresTipo = [];

    expectedKeys.forEach(key => {
        const tipoEsperado = esquema[key];
        const valor = json[key];
        if (typeof valor !== tipoEsperado) {
            erroresTipo.push(`El valor de '${key}' debe ser de tipo '${tipoEsperado}'`);
        }
    });

    if (erroresTipo.length > 0) {
        console.error(`Errores de tipo: ${erroresTipo.join(', ')}`);
        return res.sendStatus(400, "Bad request");
    }
    next();
}

var datos = [];

function API_RMP(app, dbDrugs) {

    app.use(bodyParser.json());

    app.get(API_BASE + "/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/33015692/2sA2xh4DGC");
    });

    app.get(API_BASE + "/", (req, res) => {
        dbDrugs.find({}, (err, list) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                res.send(JSON.stringify(list.map((p) => {
                    delete p._id;
                    return p;
                })));
            }
        });
    });

    //loadData
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        dbDrugs.find({}, (err, docs) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (docs.length == 0) {
                    dbDrugs.insert(initialData);
                    res.sendStatus(201, "Created");
                } else {
                    res.sendStatus(409, "Conflict");
                }
            }

        });


    });

    app.get(API_BASE + "/country/:country", (req, res) => {
        let pais = req.params.country;

        dbDrugs.findOne({ location: pais }, (err, searchedCountry) => {
            if (searchedCountry) {
                res.send(JSON.stringify(searchedCountry));
            } else {
                res.sendStatus(404, "Country not Found");
            }
        });
    });

    app.get(API_BASE + "/year/:year", (req, res) => {
        let year = parseInt(req.params.year);
        dbDrugs.find({ time: year }, (err, dataYear) => {
            if (dataYear.length === 0) {
                res.sendStatus(404, "Not Found");
            }
            else {
                res.send(JSON.stringify(dataYear));
            }
        });
    });

    app.get(API_BASE + "/pc_healthxp/:pc_healthxp", (req, res) => {
        let pc_healthxp = req.params.pc_healthxp;
        dbDrugs.find({ pc_healthxp: pc_healthxp }, (err, pc_healthxp) => {
            if (pc_healthxp.length === 0) {
                res.sendStatus(404, "Not Found");
            }
            else {
                res.send(JSON.stringify(pc_healthxp));
            }
        });
    });
    app.get(API_BASE + "/pc_gdp/:pc_gdp", (req, res) => {
        let pc_gdp = req.params.pc_gdp;
        dbDrugs.find({ pc_gdp: pc_gdp }, (err, pc_gdp) => {
            if (pc_gdp.length === 0) {
                res.sendStatus(404, "Not Found");
            }
            else {
                res.send(JSON.stringify(pc_gdp));
            }
        });
    });
    app.get(API_BASE + "/usd_cap/:usd_cap", (req, res) => {
        let usd_cap = req.params.usd_cap;
        dbDrugs.find({ usd_cap: usd_cap }, (err, usd_cap) => {
            if (usd_cap.length === 0) {
                res.sendStatus(404, "Not Found");
            }
            else {
                res.send(JSON.stringify(usd_cap));
            }
        });
    });
    app.get(API_BASE + "/total_spend/:total_spend", (req, res) => {
        let usd_cap = req.params.total_spend;
        dbDrugs.find({ total_spend: total_spend }, (err, total_spend) => {
            if (total_spend.length === 0) {
                res.sendStatus(404, "Not Found");
            }
            else {
                res.send(JSON.stringify(total_spend));
            }
        });
    });

    app.post(API_BASE + "/", validarDatos, (req, res) => {
        let drug = req.body;

        dbDrugs.findOne({ location: drug.location }, (err, existingDrug) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (existingDrug) {
                    res.sendStatus(409, "Drug already exists");
                } else {
                    dbDrugs.insert(drug, (err, datos) => {
                        if (err) {
                            res.sendStatus(500, "Internal Error");
                        } else {
                            res.sendStatus(201, "Ok");
                        }
                    });
                }
            }
        });
    });

    app.post(API_BASE + "/:country", (req, res) => {
        res.sendStatus(405, "Method not allowed");
    })

    app.put(API_BASE + "/", (req, res) => {
        res.sendStatus(405, "Method not allowed");
    });

    app.put(API_BASE + '/country/:country/:year', validarDatos, (req, res) => {
        let country = req.params.country;
        let year = parseInt(req.params.year);
        const newData = req.body;

        dbDrugs.findOne({ location: country , time: year}, (err, datos) => {
            if (err) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (datos) {
                    dbDrugs.update({ _id: datos._id }, { $set: newData }, (err, numUpdated) => {
                        if (err) {
                            res.status(500).send("Error interno del servidor");
                        } else {
                            if (numUpdated === 0) {
                                res.status(404).send("No encontrado");
                            } else {
                                res.status(200).send("Actualizado");
                            }
                        }
                    });
                } else {
                    res.sendStatus(404, "Not Found");
                }
            }
        }
        );
    });

    app.delete(API_BASE + "/", (req, res) => {

        dbDrugs.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (numRemoved >= 1) {
                    res.sendStatus(200, "All removed");
                } else {
                    res.sendStatus(404, "Drug not found");
                }
            }
        });
    });

    app.delete(API_BASE + "/country/:country", (req, res) => {
        let drugToDelete = req.params.country;
    
        dbDrugs.remove({ "Entity": drugToDelete }, {}, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (numRemoved >= 1) {
                    res.sendStatus(200, "Ok");
                } else {
                    res.sendStatus(404, "Not found");
                }
            }
        });
    });
    


}



module.exports.rmp_v1 = API_RMP;
