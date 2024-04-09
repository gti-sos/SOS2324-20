import express from "express";
let app = express();

import bodyParser from "body-parser";
import { time } from "console";

const API_BASE = '/api/v2/pharmaceutical-drugs-spending';

app.use(bodyParser.json());

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

function API_RMP_V2(app, dbDrugs) {

    app.use(bodyParser.json());

    app.get(API_BASE + "/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/33015692/2sA3Bg9FFc");
    });
    /*
    app.get(API_BASE + "/", (req, res) => {
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = parseInt(req.query.offset, 10) || 0;

        dbDrugs.find({})
            .skip(offset)
            .limit(limit)
            .exec((err, list) => {
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
*/
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

    app.get(API_BASE+ "/sizeDB" , (req, res) => {
        dbDrugs.count({}, (err, data) => {
          if (err) {
            res.sendStatus(500, err);
          } else {
            res.send(JSON.stringify(data, null, 2));
          }
        });
      });

    /*
    app.get(API_BASE + "/", (req, res) => {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const query = {};

        for (const key in req.query) {
            if (req.query.hasOwnProperty(key)) {
                if (key === "time") {
                    query[key] = parseInt(req.query[key]);
                } else if (["pc_healthxp", "pc_gdp", "usd_cap", "total_spend"].includes(key)) {
                    query[key] = parseFloat(req.query[key]);
                } else if (key === "location") {
                    query[key] = req.query[key];
                }
            }
        }

        dbDrugs.find(query).skip(offset).limit(limit).exec((err, data) => {
            if (err) {
                return res.status(500).json({ error: "Internal Server Error" });
            }
            if (!data || data.length === 0) {
                return res.status(404).json({ error: "No Data Found" });
            }
            res.json(data);
        });
    });
    */
    app.get(API_BASE + "/", (req, res) => {
        let limit = parseInt(req.query.limit) || 10;
        let offset = parseInt(req.query.offset) || 0;
        let query = req.query;
        let from = parseInt(req.query.from) || null;
        let to = parseInt(req.query.to) || null;

        for (let key in query) {
            if (query.hasOwnProperty(key)) {
                if (key === "time") {
                    query[key] = parseInt(query[key]);
                } else if (
                    key === "pc_healthxp" ||
                    key === "pc_gdp" ||
                    key === "usd_cap" ||
                    key === "total_spend" 
                ) {
                    query[key] = parseFloat(query[key]);
                } else if (key === "location") {
                    query[key] = String(query[key]);
                } else if (key === "limit" || key === "offset") {
                    delete query[key];
                } else if (key === "from" || key === "to") {
                    delete query[key];
                }
            }
        }

        if (from && to) {
            query.time = { $gte: from, $lte: to };
        } else if (from) {
            query.time = { $gte: from };
        } else if (to) {
            query.time = { $lte: to };
        }

        if (query.location && query.time && !from && !to && (!from || !to)) {
            dbDrugs
                .findOne(query)
                .sort({ location: 1, time: 1 })
                .exec((err, data) => {
                    if (err) {
                        res.sendStatus(500, err);
                    } else {
                        if (data) {
                            delete data._id;
                            res.send(JSON.stringify(data, null, 2));
                        } else {
                            res.sendStatus(404, "Not Found");
                        }
                    }
                });
        } else {
            dbDrugs
                .find(query)
                .sort({ location: 1, time: 1 })
                .skip(offset)
                .limit(limit)
                .exec((err, data) => {
                    if (err) {
                        res.sendStatus(500, err);
                    } else {
                        if (data.length === 0) {
                            res.send([]);
                        } else {
                            data.map((i) => {
                                delete i._id;
                            });
                            res.send(JSON.stringify(data, null, 2));
                        }
                    }
                });
        }
    });


    app.post(API_BASE + "/", validarDatos, (req, res) => {
        let drug = req.body;

        dbDrugs.findOne({ location: drug.location, time: drug.time }, (err, existingDrug) => {
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

    app.put(API_BASE + "/:country/:year", validarDatos, (req, res) => {
        let country = req.params.country;
        let year = parseInt(req.params.year);
        const newData = req.body;

        dbDrugs.findOne({ location: country, time: year }, (err, datos) => {
            if (err) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (datos) {
                    dbDrugs.update(
                        { _id: datos._id },
                        { $set: newData },
                        (err, numUpdated) => {
                            if (err) {
                                res.sendStatus(500, err);
                            } else {
                                if (numUpdated === 0) {
                                    res.sendStatus(400, "Bad request");
                                } else {
                                    res.sendStatus(200, "Updated");
                                }
                            }
                        }
                    );
                } else {
                    res.sendStatus(404, "Not Found");
                }
            }
        });
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

    app.delete(API_BASE + "/country/:country/:time", (req, res) => {
        let drugToDelete = req.params.country;
        let timeToDelete = parseInt(req.params.time);

        dbDrugs.remove({ "location": drugToDelete, "time": timeToDelete }, {}, (err, numRemoved) => {
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



export { API_RMP_V2 };
