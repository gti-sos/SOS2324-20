const data = [
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


function media_por_pais(attribute_name, country, datos) {
  const datos_por_pais = datos.filter(fila => fila['country'] === country);
  const lista_datos_proc = datos_por_pais.map(fila => parseFloat(fila[attribute_name]));
  const suma = lista_datos_proc.reduce((total, numero) => total + numero, 0);
  const media = suma / lista_datos_proc.length;
  return "La media del atributo " + attribute_name + ' para el país ' + country + ' es: ' + media
  // const resultado_hmtl="La media del atributo " + attribute_name + ' para el país ' + country + ' es: ' + media
  // return resultado_hmtl
}


module.exports.media_por_pais_afo = media_por_pais
module.exports.data_afo= data