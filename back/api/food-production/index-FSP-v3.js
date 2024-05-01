import express from "express";
import csv from "csv-parser";

import bodyParser from "body-parser";
import fs from "fs";

const API_BASE = "/api/v3/food-production";

var initialData = [];

function readCSVFile(filePath) {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(parseardato(data)))
      .on("end", () => {
        initialData = results;
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

function parseardato(dato) {
  for (let key in dato) {
    if (key === "Year") {
      dato[key] = parseInt(dato[key]);
    } else if (
      key === "rice_production" ||
      key === "tomatoes_production" ||
      key === "tea_production" ||
      key === "potatoes_production" ||
      key === "cocoa_beans_production" ||
      key === "meat_chicken_production" ||
      key === "bananas_production"
    ) {
      dato[key] = parseInt(dato[key]);
    } else if (key === "Entity") {
      dato[key] = String(dato[key]);
    }
  }
  return dato;
}

function validarDatos(req, res, next) {
  const json = req.body;

  const esquema = {
    Entity: "string",
    Year: "number",
    rice_production: "number",
    tomatoes_production: "number",
    tea_production: "number",
    potatoes_production: "number",
    cocoa_beans_production: "number",
    meat_chicken_production: "number",
    bananas_production: "number",
  };

  const receivedKeys = Object.keys(json);
  const expectedKeys = Object.keys(esquema);
  const missingKeys = expectedKeys.filter((key) => !receivedKeys.includes(key));

  const extraKeys = receivedKeys.filter((key) => !expectedKeys.includes(key));
  if (extraKeys.length > 0) {
    console.error(`There are more keys than expected: ${extraKeys.join(", ")}`);
    return res.sendStatus(400, "Bad request");
  }

  if (missingKeys.length > 0) {
    console.error(`There are missing keys: ${missingKeys.join(", ")}`);
    return res.sendStatus(400, "Bad request");
  }

  const erroresTipo = [];

  expectedKeys.forEach((key) => {
    const tipoEsperado = esquema[key];
    const valor = json[key];
    if (typeof valor !== tipoEsperado) {
      erroresTipo.push(
        `El valor de '${key}' debe ser de tipo '${tipoEsperado}'`
      );
    }
  });

  if (erroresTipo.length > 0) {
    console.error(`Errores de tipo: ${erroresTipo.join(", ")}`);
    return res.sendStatus(400, "Bad request");
  }
  next();
}

//API

function API_FSP_V3(app, dbFood) {
  app.use(bodyParser.json());

  readCSVFile("back/csvS/world-food-production.csv")
    .then(() => {})
    .catch((error) => console.error(error));

  app.get(API_BASE + "/docs", (req, res) => {
    res.redirect("https://documenter.getpostman.com/view/32976936/2sA3JDiRh1");
  });

  //GETs

  app.get(API_BASE + "/loadInitialData", (req, res) => {
    dbFood.find({}, (err, datos) => {
      if (err) {
        res.sendStatus(500, "Internal Error");
      } else {
        if (datos.length == 0) {
          dbFood.insert(initialData);
          res.sendStatus(201, "Data Created");
        } else {
          res.sendStatus(409, "Data already exists");
        }
      }
    });
  });

  app.get(API_BASE + "/sizeDB", (req, res) => {
    dbFood.count({}, (err, data) => {
      if (err) {
        res.sendStatus(500, err);
      } else {
        res.send(JSON.stringify(data, null, 2));
      }
    });
  });

  app.get(API_BASE + "/", (req, res) => {
    let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;
    let query = req.query;
    let from = parseInt(req.query.from) || null;
    let to = parseInt(req.query.to) || null;

    for (let key in query) {
      if (query.hasOwnProperty(key)) {
        if (key === "Year") {
          query[key] = parseInt(query[key]);
        } else if (
          key === "rice_production" ||
          key === "tomatoes_production" ||
          key === "tea_production" ||
          key === "potatoes_production" ||
          key === "cocoa_beans_production" ||
          key === "meat_chicken_production" ||
          key === "bananas_production"
        ) {
          query[key] = parseInt(query[key]);
        } else if (key === "Entity") {
          query[key] = String(query[key]);
        } else if (key === "limit" || key === "offset") {
          delete query[key];
        } else if (key === "from" || key === "to") {
          delete query[key];
        }
      }
    }

    if (from && to) {
      query.Year = { $gte: from, $lte: to };
    } else if (from) {
      query.Year = { $gte: from };
    } else if (to) {
      query.Year = { $lte: to };
    }

    if (query.Entity && query.Year && !from && !to && (!from || !to)) {

      dbFood
        .findOne(query)
        .sort({ Entity: 1, Year: 1 })  //para que salgan ordenados
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
      dbFood
        .find(query)
        .sort({ Entity: 1, Year: 1 })
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

  app.get(API_BASE + "/:country/:year", (req, res) => {
    let country = req.params.country;
    let year = parseInt(req.params.year);

    dbFood.findOne({ Entity: country, Year: year }, (err, data) => {
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
  });

  //POST
  app.post(API_BASE + "/", validarDatos, (req, res) => {
    let food = req.body;
    console.log("NEW POST WITH BODY: ", JSON.stringify(req.body, null, 2));
    dbFood.findOne({ Entity: food.Entity, Year: food.Year }, (err, existingFood) => {
      if (err) {
        res.sendStatus(500, "Internal Error");
      } else {
        if (existingFood) {
          res.sendStatus(409, "Food already exists");
        } else {
          dbFood.insert(food, (err, newFood) => {
            if (err) {
              res.sendStatus(500, "Internal Error");
            } else {
              res.sendStatus(201, "Created");
            }
          });
        }
      }
    });
  });

  app.post(API_BASE + "/:field/:value", (req, res) => {
    res.sendStatus(405, "Method not allowed");
  });

  //PUT

  app.put(API_BASE + "/", (req, res) => {
    res.sendStatus(405, "Method not allowed");
  });

  //PUT 2
  app.put(API_BASE + "/country/:country/:year", validarDatos, (req, res) => {
    let country = req.params.country;
    let year = parseInt(req.params.year);
    const newData = req.body;

    dbFood.findOne({ Entity: country, Year: year }, (err, datos) => {
      if (err) {
        res.sendStatus(500, "Internal Server Error");
      } else {
        if (datos) {
          dbFood.update(
            { _id: datos._id },
            { $set: newData },
            (err, numUpdated) => {
              if (err) {
                res.status(500).send("Error interno del servidor");
              } else {
                if (numUpdated === 0) {
                  res.status(404).send("No encontrado");
                } else {
                  res.status(200).send("Actualizado");
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

  //DELETE

  app.delete(API_BASE + "/", (_, res) => {
    dbFood.remove({}, { multi: true });
    res.sendStatus(200, "Deleted all data");
  });

  //DELETE 2
  app.delete(API_BASE + "/country/:country/:year?", (req, res) => {
    const pais = req.params.country;
    const year = req.params.year ? parseInt(req.params.year) : null;

    let query = { Entity: pais };
    if (year) {
      query.Year = year;
    }

    dbFood.find(query, (err, data) => {
      if (err) {
        res.sendStatus(500, err);
      } else {
        if (data.length > 0) {
          dbFood.remove(query, { multi: true }, (err) => {
            if (err) {
              res.sendStatus(500, err);
            } else {
              res.sendStatus(200, "Deleted");
            }
          });
        } else {
          res.sendStatus(404, "Not Found");
        }
      }
    });
  });
}
export { API_FSP_V3 };
