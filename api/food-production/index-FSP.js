let express = require("express");
let app = express();

let bodyParser = require("body-parser");

const API_BASE = "/api/v1/food-production";

app.use(bodyParser.json());

var initialData = [
    { Entity: "Afghanistan", Year: 1961, rice_production: 319000, tomatoes_production: 1873812, tea_production: 56315, potatoes_production: 130000, cocoa_beans_production: 835368, meat_chicken_production: 5600, bananas_production: 3139079 },
    { Entity: "Afghanistan", Year: 1962, rice_production: 319000, tomatoes_production: 2044797, tea_production: 61519, potatoes_production: 115000, cocoa_beans_production: 867170, meat_chicken_production: 6000, bananas_production: 3181580 },
    { Entity: "Afghanistan", Year: 1963, rice_production: 319000, tomatoes_production: 2096077, tea_production: 63596, potatoes_production: 122000, cocoa_beans_production: 922621, meat_chicken_production: 6160, bananas_production: 3304256 },
    { Entity: "Afghanistan", Year: 1964, rice_production: 380000, tomatoes_production: 2388264, tea_production: 66604, potatoes_production: 129000, cocoa_beans_production: 1190061, meat_chicken_production: 6400, bananas_production: 3392527 },
    { Entity: "Afghanistan", Year: 1965, rice_production: 380000, tomatoes_production: 2559608, tea_production: 72418, potatoes_production: 132000, cocoa_beans_production: 874245, meat_chicken_production: 6800, bananas_production: 3450849 },
    { Entity: "Afghanistan", Year: 1966, rice_production: 337000, tomatoes_production: 2690984, tea_production: 90272, potatoes_production: 136000, cocoa_beans_production: 969648, meat_chicken_production: 7200, bananas_production: 3563461 },
    { Entity: "Afghanistan", Year: 1967, rice_production: 396000, tomatoes_production: 2580187, tea_production: 86111, potatoes_production: 147000, cocoa_beans_production: 982906, meat_chicken_production: 7600, bananas_production: 3603535 },
    { Entity: "Afghanistan", Year: 1968, rice_production: 402000, tomatoes_production: 2799236, tea_production: 100736, potatoes_production: 150000, cocoa_beans_production: 855617, meat_chicken_production: 8000, bananas_production: 3732902 },
    { Entity: "Afghanistan", Year: 1969, rice_production: 407000, tomatoes_production: 3001560, tea_production: 114363, potatoes_production: 154000, cocoa_beans_production: 1004663, meat_chicken_production: 9600, bananas_production: 3914729 },
    { Entity: "Afghanistan", Year: 1970, rice_production: 366000, tomatoes_production: 3111482, tea_production: 121398, potatoes_production: 144000, cocoa_beans_production: 1120835, meat_chicken_production: 9600, bananas_production: 4076156 }

];

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

function API_FSP(app, dbFood) {
  app.use(bodyParser.json());

  app.get(API_BASE + "/docs", (req, res) => {
    res.redirect("https://documenter.getpostman.com/view/32976936/2sA2xh2sV9");
  });

  //GETs

  app.get(API_BASE + "/loadInitialData", (req, res) => {
    dbFood.find({}, (err, datos) => {
      if (err) {
        res.sendStatus(500, "Internal Error");
      } else {
        if (datos.length == 0) {
          dbFood.insert(initialData);
          res.sendStatus(201, "Created");
        } else {
          res.sendStatus(409, "Conflict");
        }
      }
    });
  });

  app.get(API_BASE + "/", (req, res) => {
    let limit = parseInt(req.query.limit, 10) || 10;
    let offset = parseInt(req.query.offset, 10) || 0;
    dbFood
      .find({})
      .skip(offset)
      .limit(limit)
      .exec((err, list) => {
        if (err) {
          res.sendStatus(500, "Internal Error");
        } else {
          res.send(
            list.map((p) => {
              delete p._id;
              return p;
            })
          );
        }
      });
  });

  app.get(API_BASE + "/:field/:value", (req, res) => {
    let limit = parseInt(req.query.limit, 10) || 10;
    let offset = parseInt(req.query.offset, 10) || 0;

    let field = req.params.field;
    let value = req.params.value;

    // Si el campo es 'Year' o cualquier campo de producción, convertir el valor a un número
    const numericFields = [
      "Year",
      "rice_production",
      "tomatoes_production",
      "tea_production",
      "potatoes_production",
      "cocoa_beans_production",
      "meat_chicken_production",
      "bananas_production",
    ];
    if (numericFields.includes(field)) {
      value = parseInt(value);
    }

    // Crear un objeto de consulta
    let query = {};
    query[field] = value;

    dbFood
      .find(query)
      .skip(offset)
      .limit(limit)
      .exec((err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          if (data.length === 0) {
            res.status(404).send("Not Found");
          } else {
            res.send(
              data.map((i) => {
                delete i._id;
                return i;
              })
            );
          }
        }
      });
  });

  //POST
  app.post(API_BASE + "/", validarDatos, (req, res) => {
    let food = req.body;

    dbFood.findOne({ Entity: food.Entity }, (err, existingFood) => {
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
              res.sendStatus(201, "Ok");
            }
          });
        }
      }
    });
  });

  app.post(API_BASE + "/:country", (req, res) => {
    res.sendStatus(405, "Method not allowed");
  });

  //PUT

  app.put(API_BASE + "/", (req, res) => {
    res.sendStatus(405, "Method not allowed");
  });

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

  app.delete(API_BASE + "/:country", (req, res) => {
    const pais = req.params.country;
    const nuevosDatos = dbFood.find((j) => j.Entity !== pais);
    if (nuevosDatos) {
      dbFood.remove({ Entity: pais }, { multi: true });
      res.sendStatus(200, "Deleted");
    } else {
      res.sendStatus(404, "Not Found");
    }
  });
}

module.exports.fsp_v1 = API_FSP;
