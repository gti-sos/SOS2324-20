const data = [
    { location: "AUS", time: 1971, pc_healthxp: 15.992, pc_gdp: 0.727, usd_cap: 35.72, total_spend: 462.11 },
    { location: "AUS", time: 1972, pc_healthxp: 15.091, pc_gdp: 0.686, usd_cap: 36.056, total_spend: 475.11 },
    { location: "AUS", time: 1973, pc_healthxp: 15.117, pc_gdp: 0.681, usd_cap: 39.871, total_spend: 533.47 },
    { location: "AUS", time: 1974, pc_healthxp: 14.771, pc_gdp: 0.755, usd_cap: 47.559, total_spend: 652.65 },
    { location: "AUS", time: 1975, pc_healthxp: 11.849, pc_gdp: 0.682, usd_cap: 47.561, total_spend: 660.76 },
    { location: "AUS", time: 1976, pc_healthxp: 10.92, pc_gdp: 0.63, usd_cap: 46.908, total_spend: 658.26 },
    { location: "AUS", time: 1977, pc_healthxp: 10.087, pc_gdp: 0.613, usd_cap: 47.649, total_spend: 676.23 },
    { location: "AUS", time: 1978, pc_healthxp: 9.958, pc_gdp: 0.591, usd_cap: 50.799, total_spend: 729.37 },
    { location: "AUS", time: 1979, pc_healthxp: 8.981, pc_gdp: 0.523, usd_cap: 49.766, total_spend: 722.3 },
    { location: "AUS", time: 1980, pc_healthxp: 9.263, pc_gdp: 0.54, usd_cap: 56.972, total_spend: 837.03 }
];

function mediaPaisGastoTotal(data, pais) {
    const filasPais = data.filter(row => row.location === pais);
    const totalGasto = filasPais.reduce((sum, row) => sum + row.total_spend, 0);
    const mediaGasto = totalGasto / filasPais.length;
    return `La media de gastoTotal producidos en ${pais} es: ${mediaGasto}`
}


module.exports.media_por_pais_gasto_total_rmp = mediaPaisGastoTotal
module.exports.data_rmp = data
/*

// Filtra las filas para obtener solo las de "AUS"
const FilasAUS = data.filter(row => row.location === 'AUS');

const mediaTotalSpend = FilasAUS.reduce((sum, row) => sum + row.total_spend, 0) / FilasAUS.length;

console.log(`La media del gasto total en dolares por pais es: ${mediaTotalSpend}`);
*/

