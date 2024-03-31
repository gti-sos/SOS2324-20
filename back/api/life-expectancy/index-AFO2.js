import bodyParser from "body-parser";
import fs from "fs";
import csv from "csv-parser";

const API_BASE = "/api/v2/life-expectancy";

var initialData = [];

function readCSVFile(filePath) {
    const results = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                initialData = results;
                resolve();
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

function validarDatos(req, res, next) {
  const json = req.body;
  const esquema = {
    country: "string",
    year: "number",
    continent: "string",
    life_expectancy: "number",
    population: "number",
    co2_emissions: "number",
    electric_power_consumption: "number",
    forest_area: "number",
    individuals_using_the_internet: "number",
    military_expenditure: "number",
    people_practicing_open_defecation: "number",
    people_using_at_least_basic_drinking_water_services: "number",
    beer_consumption_per_capita: "number",
  };

  const receivedKeys = Object.keys(json);
  const expectedKeys = Object.keys(esquema);
  const missingKeys = expectedKeys.filter((key) => !receivedKeys.includes(key));

  const extraKeys = receivedKeys.filter((key) => !expectedKeys.includes(key));
  if (extraKeys.length > 0) {
    return res.sendStatus(400, "Bad request");
  }

  if (missingKeys.length > 0) {
    return res.sendStatus(400, "Bad request");
  }

  const erroresTipo = [];

  expectedKeys.forEach((key) => {
    const tipoEsperado = esquema[key];
    const valor = json[key];
    if (typeof valor !== tipoEsperado) {
      erroresTipo.push(`The value of '${key}' must be '${tipoEsperado}'`);
    }
  });

  if (erroresTipo.length > 0) {
    return res.sendStatus(400, "Bad request");
  }
  next();
}

//API

function API_AFO_V2(app, dbLifeExpectancy) {
  app.use(bodyParser.json());

  readCSVFile('back/csvS/life_expectancy.csv')
    .then(() => {})
    .catch(error => console.error(error));

  app.get(API_BASE + "/docs", (_req, res) => {
    res.redirect("https://documenter.getpostman.com/view/32925029/2sA2xh3tTs");
  });

  app.get(API_BASE + "/loadCSVData",(_req, res) => {
    dbLifeExpectancy.find({}, (err, datos) => {
      if (err) {
        res.sendStatus(500, "Internal Server Error");
      } else {
        if (datos.length === 0) {
          dbLifeExpectancy.insert(initialData);
          res.sendStatus(201, "Data created");
        } else {
          res.sendStatus(409, "Data already exists");
        }
      }
    });
  });

  app.get(API_BASE + "/", (req, res) => {
    let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;
    let query = req.query;
    for (let key in query) {
        if (query.hasOwnProperty(key)) {
            if (key === "year") {
                query[key] = parseInt(query[key]);
            } else if (
                key === "life_expectancy" ||
                key === "population" ||
                key === "co2_emissions" ||
                key === "electric_power_consumption" ||
                key === "forest_area" ||
                key === "individuals_using_the_internet" ||
                key === "military_expenditure" ||
                key === "people_practicing_open_defecation" ||
                key === "people_using_at_least_basic_drinking_water_services" ||
                key === "beer_consumption_per_capita"
            ) {
                query[key] = parseFloat(query[key]);
            } else if (key === "country" || key === "continent") {
                query[key] = String(query[key]);
            }
        }
    }

    if (query.country && query.year) {
        dbLifeExpectancy.findOne(query).sort({ country: 1, year: 1 }).exec((err, data) => {
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
        dbLifeExpectancy
            .find(query)
            .sort({ country: 1, year: 1 })
            .skip(offset)
            .limit(limit)
            .exec((err, data) => {
                if (err) {
                    res.sendStatus(500, err);
                } else {
                    if (data.length === 0) {
                        res.sendStatus(404, "Not Found");
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

  //POST 1
  app.post(API_BASE + "/", validarDatos, (req, res) => {
    let data = req.body;
    dbLifeExpectancy.findOne(
      { country: data.country, year: data.year },
      (err, datos) => {
        if (err) {
          res.sendStatus(500, "Internal Server Error");
        } else {
          if (datos) {
            res.sendStatus(409, "Conflict");
          } else {
            dbLifeExpectancy.insert(data, (err) => {
              if (err) {
                res.sendStatus(500, "Internal Server Error");
              } else {
                res.sendStatus(201, "Created");
              }
            });
          }
        }
      }
    );
  });

  //PUT 1
  app.put(API_BASE + "/", (_, res) => {
    res.sendStatus(405, "Method Not Allowed");
  });

  //DELETE 1
  app.delete(API_BASE + "/", (_, res) => {
    dbLifeExpectancy.remove({}, { multi: true });
    res.sendStatus(200, "Deleted all data");
  });

  //post 2
  app.post(API_BASE + "/:field/:value", (_, res) => {
    res.sendStatus(405, "Method Not Allowed");
  });

  //put 2
  app.put(API_BASE + "/country/:country/:year", validarDatos, (req, res) => {
    let country = req.params.country;
    let year = parseInt(req.params.year);
    const newData = req.body;

    dbLifeExpectancy.findOne({ country: country, year: year }, (err, datos) => {
      if (err) {
        res.sendStatus(500, "Internal Server Error");
      } else {
        if (datos) {
          dbLifeExpectancy.update(
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

  //delete 2
  app.delete(API_BASE + "/country/:country/:year?", (req, res) => {
    const pais = req.params.country;
    const year = req.params.year ? parseInt(req.params.year) : null;

    let query = { country: pais };
    if (year) {
      query.year = year;
    }

    dbLifeExpectancy.find(query, (err, data) => {
      if (err) {
        res.sendStatus(500, err);
      } else {
        if (data.length > 0) {
          dbLifeExpectancy.remove(query, { multi: true }, (err) => {
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

export { API_AFO_V2 };
