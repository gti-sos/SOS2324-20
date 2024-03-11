let express = require("express");
let app = express();

let bodyParser = require("body-parser");


const API_BASE = '/api/v1/life-expectancy';

app.use(bodyParser.json());

var initialData = [
    {country: "albania", year: 2000, continet: "europe", life_expectancy: 73.955, population: 3089027, co2_emissions: 1.02621311, electric_power_consumption: 1414.70378, forest_area: 28.0766423, individuals_using_the_internet: 0.114097350, military_expenditure: 1.24636024, people_practicing_open_defecation: 0.88885278, people_using_at_least_basic_drinking_water_services: 86.7544706, beer_consumption_per_capita: 1.33431},
    {country: "albania", year: 2001, continet: "europe", life_expectancy: 74.288, population: 3060173, co2_emissions: 1.05549588, electric_power_consumption: 1449.64741, forest_area: 28.1232482, individuals_using_the_internet: 0.325798380, military_expenditure: 1.30929138, people_practicing_open_defecation: 0.83639705, people_using_at_least_basic_drinking_water_services: 86.9040703, beer_consumption_per_capita: 1.48995},
    {country: "albania", year: 2002, continet: "europe", life_expectancy: 74.579, population: 3051010, co2_emissions: 1.23237878, electric_power_consumption: 1351.23080, forest_area: 28.1698540, individuals_using_the_internet: 0.390081270, military_expenditure: 1.32003449, people_practicing_open_defecation: 0.78189876, people_using_at_least_basic_drinking_water_services: 87.4516352, beer_consumption_per_capita: 1.28697},
    {country: "albania", year: 2003, continet: "europe", life_expectancy: 74.828, population: 3039616, co2_emissions: 1.33898498, electric_power_consumption: 1578.16592, forest_area: 28.2164599, individuals_using_the_internet: 0.971900420, military_expenditure: 1.33684292, people_practicing_open_defecation: 0.72819101, people_using_at_least_basic_drinking_water_services: 87.9871940, beer_consumption_per_capita: 1.44830},
    {country: "bahrain", year: 2000, continet: "asia", life_expectancy: 74.440, population: 664610, co2_emissions: 2.38937121, electric_power_consumption: 2063.81374, forest_area: 0.5211268, individuals_using_the_internet: 6.153732546, military_expenditure: 3.96167097, people_practicing_open_defecation: 0.00000000, people_using_at_least_basic_drinking_water_services: 99.9100805, beer_consumption_per_capita: 5.38450},
    {country: "bahrain", year: 2001, continet: "asia", life_expectancy: 74.635, population: 697550, co2_emissions: 2.34965236, electric_power_consumption: 2001.47455, forest_area: 0.5422535, individuals_using_the_internet: 15.038634250, military_expenditure: 4.14808163, people_practicing_open_defecation: 0.00000000, people_using_at_least_basic_drinking_water_services: 99.9175187, beer_consumption_per_capita: 5.35570},
    {country: "bahrain", year: 2002, continet: "asia", life_expectancy: 74.822, population: 735140, co2_emissions: 2.34241088, electric_power_consumption: 2013.04566, forest_area: 0.5633803, individuals_using_the_internet: 18.050720890, military_expenditure: 4.61110661, people_practicing_open_defecation: 0.00000000, people_using_at_least_basic_drinking_water_services: 99.9249569, beer_consumption_per_capita: 5.36540},
    {country: "bahrain", year: 2003, continet: "asia", life_expectancy: 74.999, population: 778708, co2_emissions: 2.30381613, electric_power_consumption: 2001.65955, forest_area: 0.5763889, individuals_using_the_internet: 21.554944990, military_expenditure: 4.65883280, people_practicing_open_defecation: 0.00000000, people_using_at_least_basic_drinking_water_services: 99.9323951, beer_consumption_per_capita: 5.25680},
    {country: "bahrain", year: 2004, continet: "asia", life_expectancy: 75.167, population: 829846, co2_emissions: 2.16064189, electric_power_consumption: 1977.50633, forest_area: 0.5890411, individuals_using_the_internet: 21.458680510, military_expenditure: 4.04492885, people_practicing_open_defecation: 0.00000000, people_using_at_least_basic_drinking_water_services: 99.9398333, beer_consumption_per_capita: 5.29480},
    {country: "bahrain", year: 2010, continet: "asia", life_expectancy: 76.057, population: 1240864, co2_emissions: 2.09289651, electric_power_consumption: 1745.96545, forest_area: 0.6824147, individuals_using_the_internet: 55.000000000, military_expenditure: 3.27775594,people_practicing_open_defecation: 0.00000000, people_using_at_least_basic_drinking_water_services: 99.9844624, beer_consumption_per_capita: 4.70000}

];
function validarDatos(req, res, next) {
    const json = req.body;
    const esquema = {
        'country': 'string',
        'year': 'number',
        'continent': 'string',
        'life_expectancy': 'number',
        'population': 'number',
        'co2_emissions': 'number',
        'electric_power_consumption': 'number',
        'forest_area': 'number',
        'individuals_using_the_internet': 'number',
        'military_expenditure': 'number',
        'people_practicing_open_defecation': 'number',
        'people_using_at_least_basic_drinking_water_services': 'number',
        'beer_consumption_per_capita': 'number'
    };

    const receivedKeys = Object.keys(json);
    const expectedKeys = Object.keys(esquema);
    const missingKeys = expectedKeys.filter(key => !receivedKeys.includes(key));

    const extraKeys = receivedKeys.filter(key => !expectedKeys.includes(key));
    if (extraKeys.length > 0) {
        console.error(`Hay más claves de las esperadas: ${extraKeys.join(', ')}`);
        return res.status(400).send("Solicitud incorrecta");
    }

    if (missingKeys.length > 0) {
        console.error(`Faltan claves: ${missingKeys.join(', ')}`);
        return res.status(400).send("Solicitud incorrecta");
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
        return res.status(400).send("Solicitud incorrecta");
    }
    next();
}


//API 

function API_AFO(app, dbLifeExpectancy) {

    app.use(bodyParser.json());

    const limit = parseInt(req.query.limit, 10) || 10; 
    const offset = parseInt(req.query.offset, 10) || 0; 

    app.get(API_BASE+"/docs",(req,res)=> {
        res.redirect("https://documenter.getpostman.com/view/32925029/2sA2xh3tTs");
      });


    app.get(API_BASE + "/loadInitialData", (req, res) => {
        dbLifeExpectancy.find({}, (err, datos) => {
            if (err) {
                res.sendStatus(500,"Internal Server Error");
            } else{
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

       
        dbLifeExpectancy.find({}, (err, datos) => {
            if (err) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                limit, offset;
                res.send(JSON.stringify(datos.map((c) => {
                    delete c._id;
                    return c;
                })));
            }
        }
        );
    });


    app.get(API_BASE + "/country/:country", (req, res) => {
        let country = req.params.country;
        dbLifeExpectancy.find({country: country}, (err, searchedCountry) => {
            if(searchedCountry.length === 0){
                res.sendStatus(404, "Not Found");
            }else{
                limit, offset;
                res.send(JSON.stringify(searchedCountry));
            }
        });
    });

    app.get(API_BASE + "/year/:year", (req, res) => {
        let year = parseInt(req.params.year);
        dbLifeExpectancy.find({ year: year }, (err, dataYear) => {
            if(dataYear.length === 0){
                res.sendStatus(404, "Not Found");
            }
            else{
                limit, offset;
                res.send(JSON.stringify(dataYear)); 
            }
        });
    });

    //busqueda por continet 
    app.get(API_BASE + "/continent/:continent", (req, res) => {
        let continent = req.params.continent;
        dbLifeExpectancy.find({ continent: continent }, (err, continents) => {
            if(continents.length === 0){
                res.sendStatus(404, "Not Found");
            }
            else{
                limit, offset;
                res.send(JSON.stringify(continents));
            }
        });
    });
    
     // busqueda por life_expectancy
     app.get(API_BASE + "/life_expectancy/:life_expectancy", (req, res) => {
        let life_expectancy = parseFloat(req.params.life_expectancy);
        dbLifeExpectancy.find({ life_expectancy: life_expectancy }, (err, life_expectancies) => {
            if(life_expectancies.length === 0){
                res.sendStatus(404, "Not Found");
            }
            else{
                limit, offset;
                res.send(JSON.stringify(life_expectancies));
            }
        });
    });

    // busqueda por population
    app.get(API_BASE + "/population/:population", (req, res) => {
        let population = parseInt(req.params.population);
        dbLifeExpectancy.find({ population: population }, (err, dataPopulation) => {
            if(dataPopulation.length === 0){
                res.sendStatus(404, "Not Found");
            }
            else{
                limit, offset;
                res.send(JSON.stringify(dataPopulation));
                
            }
        });
    });

    // busqueda por co2_emissions
    app.get(API_BASE + "/co2_emissions/:co2_emissions", (req, res) => {
        let co2_emissions = parseFloat(req.params.co2_emissions);
        dbLifeExpectancy.find({ co2_emissions: co2_emissions }, (err, dataCo2) => {
            if(dataCo2.length === 0){
                res.sendStatus(404, "Not Found");
            }
            else{
                limit, offset;
                res.send(JSON.stringify(dataCo2));
            }
        });
    });

    // busqueda por electric_power_consumption
    app.get(API_BASE + "/electric_power_consumption/:electric_power_consumption", (req, res) => {
        let electric_power_consumption = parseFloat(req.params.electric_power_consumption);
        dbLifeExpectancy.find({ electric_power_consumption: electric_power_consumption }, (err, dataPower) => {
            if(dataPower.length === 0){
                res.sendStatus(404, "Not Found");
            }
            else{
                limit, offset;
                res.send(JSON.stringify(dataPower));
            }
        });
    });

    // busqueda por forest_area
    app.get(API_BASE + "/forest_area/:forest_area", (req, res) => {
        let forest_area = parseFloat(req.params.forest_area);
        dbLifeExpectancy.find({ forest_area: forest_area }, (err, dataForest) => {
            if(dataForest.length === 0){
                res.sendStatus(404, "Not Found");
            }
            else{
                limit, offset;
                res.send(JSON.stringify(dataForest));
            }
        });
    });

    // busqueda por individuals_using_the_internet
    app.get(API_BASE + "/individuals_using_the_internet/:individuals_using_the_internet", (req, res) => {
        let individuals_using_the_internet = parseFloat(req.params.individuals_using_the_internet);
        dbLifeExpectancy.find({ individuals_using_the_internet: individuals_using_the_internet }, (err, dataInternet) => {
            if(dataInternet.length === 0){
                res.sendStatus(404, "Not Found");
            }
            else{
                limit, offset;
                res.send(JSON.stringify(dataInternet));
            }
        });
    });

    // busqueda por military_expenditure
    app.get(API_BASE + "/military_expenditure/:military_expenditure", (req, res) => {
        let military_expenditure = parseFloat(req.params.military_expenditure);
        dbLifeExpectancy.find({ military_expenditure: military_expenditure }, (err, dataMilitary) => {
            if(dataMilitary.length === 0){
                res.sendStatus(404, "Not Found");
            }
            else{
                limit, offset;
                res.send(JSON.stringify(dataMilitary));
            }
        });
    });

    // busqueda por people_practicing_open_defecation
    app.get(API_BASE + "/people_practicing_open_defecation/:people_practicing_open_defecation", (req, res) => {
        let people_practicing_open_defecation = parseFloat(req.params.people_practicing_open_defecation);
        dbLifeExpectancy.find({ people_practicing_open_defecation: people_practicing_open_defecation }, (err, dataDefecation) => {
            if(dataDefecation.length === 0){
                res.sendStatus(404, "Not Found");
            }
            else{
                limit, offset;
                res.send(JSON.stringify(dataDefecation));
            }
        });
    });

    // busqueda por people_using_at_least_basic_drinking_water_ervices
    app.get(API_BASE + "/people_using_at_least_basic_drinking_water_ervices/:people_using_at_least_basic_drinking_water_ervices", (req, res) => {
        let people_using_at_least_basic_drinking_water_ervices = parseFloat(req.params.people_using_at_least_basic_drinking_water_ervices);
        dbLifeExpectancy.find({ people_using_at_least_basic_drinking_water_ervices: people_using_at_least_basic_drinking_water_ervices }, (err, dataWater) => {
            if(dataWater.length === 0){
                res.sendStatus(404, "Not Found");
            }
            else{
                limit, offset;
                res.send(JSON.stringify(dataWater));
            }
        });
    });

    // busqueda por beer_consumption_per_capita
    app.get(API_BASE + "/beer_consumption_per_capita/:beer_consumption_per_capita", (req, res) => {
        let beer_consumption_per_capita = parseFloat(req.params.beer_consumption_per_capita);
        dbLifeExpectancy.find({ beer_consumption_per_capita: beer_consumption_per_capita }, (err, dataBeer) => {
            if(dataBeer.length === 0){
                res.sendStatus(404, "Not Found");
            }
            else{
                limit, offset;
                res.send(JSON.stringify(dataBeer));
            }
        });
    });

    //POST 1
    app.post(API_BASE + "/",validarDatos, (req, res) => {
        let data = req.body;
        dbLifeExpectancy.findOne({ country: data.country, year: data.year }, (err, datos) => {
            if (err){
                res.sendStatus(500, "Internal Server Error");
            }
            else{
                if (datos) {
                    res.sendStatus(409, "Conflict");
                } else {
                    dbLifeExpectancy.insert(data , (err, datos) => {
                        if (err) {
                            res.sendStatus(500, "Internal Server Error");
                        } else {
                            res.sendStatus(201, "Created");
                        }
                    });
                }
            }
        });
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
    app.post(API_BASE + "/country/:country", (_, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });

    //put 2
    app.put(API_BASE + '/country/:country/:year', validarDatos, (req, res) => {
        let country = req.params.country;
        let year = parseInt(req.params.year);
        const newData = req.body;

        dbLifeExpectancy.findOne({ country: country , year: year}, (err, datos) => {
            if (err) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (datos) {
                    dbLifeExpectancy.update({ _id: datos._id }, { $set: newData }, (err, numUpdated) => {
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
   
    //delete 2
    app.delete(API_BASE + "/country/:country", (req, res) => {
        const pais = req.params.country;
        const nuevosDatos = dbLifeExpectancy.find(j => j.country !== pais);
        if(nuevosDatos){
            dbLifeExpectancy.remove({country: pais} , {multi: true});
            res.sendStatus(200, "Deleted");
        }
        else{
            res.sendStatus(404, "Not Found");
        }
    });

}

module.exports.afo_v1 = API_AFO;
