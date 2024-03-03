
let express = require("express");
let app = express();
const afo = require("./index-AFO");

let bodyParser = require("body-parser");

const API_BASE = '/api/v1/life-expectancy';


var datos = [];

//API 

function API_AFO(app) {

    app.use(bodyParser.json());

   
    //GET 1
    app.get(API_BASE + "/", (req, res) => {
        //lista con todos los datos
        res.status(200).send(JSON.stringify(datos));
    });

    //El recurso debe contener una ruta /api/v1/FFFFF/loadInitialData 
    //que al hacer un GET cree 10 o más datos en el array de NodeJS si está vacío.
    app.get(API_BASE + "/loadInitialData", (req, res) => {
            let csv = [
                {country: "albania", year: 2000, continet: "europe", life_expectancy: 73.955, population: 3089027, co2_emissions: 1.02621311, electric_power_consumption: 1414.70378, forest_area: 28.0766423, individuals_using_the_internet: 0.114097350, military_expenditure: 1.24636024, people_practicing_open_defecation: 0.88885278, people_using_at_least_basic_drinking_water_ervices: 86.7544706, beer_consumption_per_capita: 1.33431},
                {country: "albania", year: 2001, continet: "europe", life_expectancy: 74.288, population: 3060173, co2_emissions: 1.05549588, electric_power_consumption: 1449.64741, forest_area: 28.1232482, individuals_using_the_internet: 0.325798380, military_expenditure: 1.30929138, people_practicing_open_defecation: 0.83639705, people_using_at_least_basic_drinking_water_ervices: 86.9040703, beer_consumption_per_capita: 1.48995},
                {country: "albania", year: 2002, continet: "europe", life_expectancy: 74.579, population: 3051010, co2_emissions: 1.23237878, electric_power_consumption: 1351.23080, forest_area: 28.1698540, individuals_using_the_internet: 0.390081270, military_expenditure: 1.32003449, people_practicing_open_defecation: 0.78189876, people_using_at_least_basic_drinking_water_ervices: 87.4516352, beer_consumption_per_capita: 1.28697},
                {country: "albania", year: 2003, continet: "europe", life_expectancy: 74.828, population: 3039616, co2_emissions: 1.33898498, electric_power_consumption: 1578.16592, forest_area: 28.2164599, individuals_using_the_internet: 0.971900420, military_expenditure: 1.33684292, people_practicing_open_defecation: 0.72819101, people_using_at_least_basic_drinking_water_ervices: 87.9871940, beer_consumption_per_capita: 1.44830},
                {country: "bahrain", year: 2000, continet: "asia", life_expectancy: 74.440, population: 664610, co2_emissions: 2.38937121, electric_power_consumption: 2063.81374, forest_area: 0.5211268, individuals_using_the_internet: 6.153732546, military_expenditure: 3.96167097, people_practicing_open_defecation: 0.00000000, people_using_at_least_basic_drinking_water_ervices: 99.9100805, beer_consumption_per_capita: 5.38450},
                {country: "bahrain", year: 2001, continet: "asia", life_expectancy: 74.635, population: 697550, co2_emissions: 2.34965236, electric_power_consumption: 2001.47455, forest_area: 0.5422535, individuals_using_the_internet: 15.038634250, military_expenditure: 4.14808163, people_practicing_open_defecation: 0.00000000, people_using_at_least_basic_drinking_water_ervices: 99.9175187, beer_consumption_per_capita: 5.35570},
                {country: "bahrain", year: 2002, continet: "asia", life_expectancy: 74.822, population: 735140, co2_emissions: 2.34241088, electric_power_consumption: 2013.04566, forest_area: 0.5633803, individuals_using_the_internet: 18.050720890, military_expenditure: 4.61110661, people_practicing_open_defecation: 0.00000000, people_using_at_least_basic_drinking_water_ervices: 99.9249569, beer_consumption_per_capita: 5.36540},
                {country: "bahrain", year: 2003, continet: "asia", life_expectancy: 74.999, population: 778708, co2_emissions: 2.30381613, electric_power_consumption: 2001.65955, forest_area: 0.5763889, individuals_using_the_internet: 21.554944990, military_expenditure: 4.65883280, people_practicing_open_defecation: 0.00000000, people_using_at_least_basic_drinking_water_ervices: 99.9323951, beer_consumption_per_capita: 5.25680},
                {country: "bahrain", year: 2004, continet: "asia", life_expectancy: 75.167, population: 829846, co2_emissions: 2.16064189, electric_power_consumption: 1977.50633, forest_area: 0.5890411, individuals_using_the_internet: 21.458680510, military_expenditure: 4.04492885, people_practicing_open_defecation: 0.00000000, people_using_at_least_basic_drinking_water_ervices: 99.9398333, beer_consumption_per_capita: 5.29480},
                {country: "bahrain", year: 2010, continet: "asia", life_expectancy: 76.057, population: 1240864, co2_emissions: 2.09289651, electric_power_consumption: 1745.96545, forest_area: 0.6824147, individuals_using_the_internet: 55.000000000, military_expenditure: 3.27775594,people_practicing_open_defecation: 0.00000000, people_using_at_least_basic_drinking_water_ervices: 99.9844624, beer_consumption_per_capita: 4.70000}
                ];
        for (let i = 0; i < csv.length; i++) {
            datos.push(csv[i])
        }
        res.sendStatus(201, "Data created");
    });

    //POST 1
    app.post(API_BASE + "/", (req, res) => {
        let data = req.body;
        const datosEle = datos.some(j => j.country === data.country && j.year === data.year);
        if (datosEle) {
            //No se puede hacer un POST con un recurso que ya existe;
            //en el caso contrario se debe devolver el código 409
            res.sendStatus(409, "CONFLICT");
        } else if (!data || Object.keys(data).length === 0) {
            //Si se recibe un dato (JSON) que no tiene los 
            //campos esperados se debe devolver el código 400
            res.sendStatus(400, "BAD REQUEST");
        } else {
            //Crea dato
            datos.push(data);
            res.sendStatus(201, "CREATED");
        }
    });
    
    app.put(API_BASE + "/", (req, res) => {
        // Obtén los datos desde el cuerpo de la solicitud
        res.sendStatus(405, "Method not allowed");
    });

    
    //DELETE 1
    app.delete(API_BASE + "/", (req, res) => {
        // Eliminar todos los datos
        datos.splice(0, datos.length); // Elimina todos los elementos del array
        res.sendStatus(200, "Delete all");
    });


    //AHORA RUTAS ESPECIFICAS DE COUNTRY

    //POST 2
    app.post(API_BASE + "/:country", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });

    //GET 2
    app.get(API_BASE + "/:country", (req, res) => {
    //filtramos 
        const pais = req.params.country;
        const datosPais = datos.filter(p => p.country === pais);

     if (datosPais.length > 0) {
        //muestra los datos ya filtrados
        res.send(JSON.stringify(datosPais))
        res.sendStatus(200, "OK");
    } else {
        //Si se intenta acceder a un recurso 
        //inexistente se debe devolver el código 404
        res.sendStatus(404, "Not Found");
    }
});

//PUT 2
app.put(API_BASE + "/:country", (req, res) => {

    const pais = req.params.country;
    let data = req.body;
    let actualizado = false;

    for (let i=0;  i < datos.length; i++) {
        if (datos[i].country === pais) {
            datos[i] = data;
            actualizado = true;
            break;
        }
    }

    if (!actualizado) {
        res.status(404).send("Not Found");
    } else {
        res.status(200).send("OK");
    } 
});

//DELETE 2
app.delete(API_BASE + "/:country", (req, res) => {
    const pais = req.params.country;
    const nuevosDatos = datos.filter(entrada => entrada.country !== pais);

    if (nuevosDatos.length < datos.length) {
        //eliminar los datos del filtro
        datos = nuevosDatos;
        res.sendStatus(200, "OK");
    } else {
        //Si se intenta acceder a un recurso 
        //inexistente se debe devolver el código 404
        res.sendStatus(404, "Not Found");
    }

});

    //MANEJAR RUTAS QUE NO EXISTEN
    app.use((req, res, next) => {
        res.status(404).send('Recurso no encontrado');
      });
}

module.exports.afo_v1 = API_AFO;
