<script>
	import { onMount } from 'svelte';

	onMount(() => {
		getData();
	});

	let API = 'https://sos2324-20-415018.ew.r.appspot.com/api/v2/food-production';
	let dataAvailable = false;

	async function getData() {
		try {
			const res = await fetch(API); // Obtener todos los datos
			const data = await res.json();
			console.log(`Data received: ${JSON.stringify(data, null, 2)}`);

			if (data.length > 0) {
				dataAvailable = true;
				const year1961Data = data.find((item) => item.Year === 1961); // Obtener datos para el año 1961
				createGraph(year1961Data);
				createSecondGraph(data); // Pasar todos los datos para la segunda gráfica
			}
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	function createGraph(data) {
		const totalProduction = Object.values(data).reduce((acc, value) => {
			return typeof value === 'number' ? acc + value : acc;
		}, 0);

		const productionPercentages = Object.entries(data)
			.filter(([key, value]) => typeof value === 'number' && key !== 'Year')
			.map(([key, value]) => ({
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
				series: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						distance: 20,
						format: '{point.percentage:.1f}%'
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

	function createSecondGraph(data) {
		const years = Array.from(new Set(data.map(item => item.Year))); // Obtener años únicos

		const seriesData = Object.keys(data[0]).filter(key => key !== 'Entity' && key !== 'Year').map((property, index) => ({
			name: property.replace('_production', '').replace('_', ' '), // Cambiar las etiquetas al español
			data: years.map(year => {
				const yearData = data.find(item => item.Year === year);
				return {
					x: year, // Mostrar los años en el eje X
					y: yearData ? yearData[property] : 0 // Mantener la producción en el eje Y
				};
			})
		}));

		Highcharts.chart('secondContainer', {
			chart: {
				type: 'areaspline'
			},
			title: {
				text: 'Comparación de Producción a lo Largo de los Años' // Cambiar título al español
			},
			xAxis: {
				title: {
					text: 'Año' // Cambiar etiqueta del eje X al español
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
	}
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/data.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<div id="container" style="width:100%; height:400px;"></div>
<div id="secondContainer" style="width:100%; height:600px;"></div>
