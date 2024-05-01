<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API = '/api/v3/food-production';
	if (dev) {
		API = 'http://localhost:10000/api/v3/food-production';
	}

	async function getGraph1() {
		try {
			const res = await fetch(API + '?Entity=Afghanistan&Year=2021');
			const data = await res.json();
			console.log(`Data received: ${JSON.stringify(data, null, 2)}`);
			createPieChart(data);
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	function createPieChart(data) {
		const productionData = Object.entries(data).filter(
			([key, value]) => typeof value === 'number' && key !== 'Entity' && key !== 'Year'
		);

		const totalProduction = productionData.reduce((acc, [key, value]) => acc + value, 0);

		const productionPercentages = productionData.map(([key, value]) => ({
			name: key.replace('_production', '').replace('_', ' '),
			y: (value / totalProduction) * 100
		}));

		Highcharts.chart('container', {
			chart: {
				type: 'pie'
			},
			title: {
				text: `Producción distribuida de ${data.Entity} en el año ${data.Year}`
			},
			tooltip: {
				valueSuffix: '%'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						distance: 20,
						format: '{point.name}: {point.percentage:.1f}%'
					}
				}
			},
			series: [
				{
					name: 'Percentage',
					colorByPoint: true,
					data: productionPercentages
				}
			]
		});
	}

	let isCreatingSecondGraph = false;
	async function createSecondGraph(entity, startYear, endYear) {
		if (isCreatingSecondGraph) return; // Si ya se está creando la gráfica, salir de la función
		isCreatingSecondGraph = true; // Marcar que se está creando la gráfica
		try {
			// Array para almacenar los datos de producción de cada año
			let allData = [];

			// Iterar sobre todos los años desde startYear hasta endYear
			for (let year = startYear; year <= endYear; year++) {
				const res = await fetch(`${API}?Entity=${entity}&Year=${year}`);
				const data = await res.json();
				allData.push(data);
			}

			console.log(`Data received: ${JSON.stringify(allData, null, 2)}`);

			// Crear los datos de la serie para la gráfica
			const years = Array.from(new Set(allData.map(item => item.Year)));

			const seriesData = Object.keys(allData[0]).filter(key => key !== 'Entity' && key !== 'Year').map((property, index) => ({
				name: property.replace('_production', '').replace('_', ' '), // Cambiar las etiquetas al español
				data: years.map(year => {
					const yearData = allData.find(item => item.Year === year);
					return yearData ? yearData[property] : 0; // Mantener la producción en el eje Y
				})
			}));

			// Crear la gráfica de Highcharts
			Highcharts.chart('secondContainer', {
				chart: {
					type: 'areaspline'
				},
				title: {
					text: 'Comparación de Producción en Afghanistan a lo Largo de los Años' // Cambiar título al español
				},
				xAxis: {
					title: {
						text: 'Años' // Cambiar etiqueta del eje X al español
					},
					categories: years // Especificar las etiquetas del eje X como los años
				},
				yAxis: {
					title: {
						text: 'Producción' // Mantener etiqueta del eje Y en inglés
					}
				},
				plotOptions: {
					series: {
						marker: {
							enabled: false // Desactivar los marcadores en los puntos de datos
						}
					}
				},
				series: seriesData
			});
		} finally {
			isCreatingSecondGraph = false; // Reiniciar la bandera después de que se complete la creación de la gráfica
		}
	}

	onMount(async () => {
		await getGraph1();
		const entity = 'Afghanistan';
		const startYear = 2011;
		const endYear = 2021;
		await createSecondGraph(entity, startYear, endYear);
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/data.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<div id="container" style="width:100%; height:400px;"></div>
<div id="secondContainer" style="width:100%; height:600px;"></div>
