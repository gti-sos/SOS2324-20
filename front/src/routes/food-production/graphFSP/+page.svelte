<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	//import * as am5 from "@amcharts/amcharts5";

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
			const years = Array.from(new Set(allData.map((item) => item.Year)));

			const seriesData = Object.keys(allData[0])
				.filter((key) => key !== 'Entity' && key !== 'Year')
				.map((property, index) => ({
					name: property.replace('_production', '').replace('_', ' '), // Cambiar las etiquetas al español
					data: years.map((year) => {
						const yearData = allData.find((item) => item.Year === year);
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

	//Gráfica con amCharts

	async function getGraph3() {
		try {
			const res = await fetch(API + '?Year=2001&limit=10000&offset=0');
			const data = await res.json();
			console.log(`Data received amCharts: ${JSON.stringify(data, null, 2)}`);

			// Llamar a la función para crear el gráfico de amCharts con los datos recibidos
			createAmchartsGraph(data);
		} catch (error) {
			console.log(`Error fetching data and creating amCharts map: ${error}`);
		}
	}

	// Crear un gráfico de mapa utilizando amcharts
	function createAmchartsGraph(data) {
		// Elemento raíz
		var root = am5.Root.new('amcharts-container');

		// Tema
		root.setThemes([am5themes_Animated.new(root)]);

		// Crear el gráfico de mapa
		var chart = root.container.children.push(am5map.MapChart.new(root, {}));

		// Crear la serie principal de polígonos para los países
		var polygonSeries = chart.series.push(
			am5map.MapPolygonSeries.new(root, {
				geoJSON: am5geodata_worldLow,
				exclude: ['AQ'] // Excluir la Antártida
			})
		);

		const groupedData = data.reduce((acc, item) => {
			if (!acc[item.Entity]) {
				acc[item.Entity] = {
					id: item.Entity,
					name: item.Entity,
					value: 0
				};
			}
			acc[item.Entity].value += item.meat_chicken_production;
			return acc;
		}, {});

		const filteredData = Object.values(groupedData);
		console.log(`FILTERED DATA amCharts: ${JSON.stringify(filteredData, null, 2)}`);
		// Asignar los valores acumulados a los polígonos
		let bubbleSeries = chart.series.push(
			am5map.MapPointSeries.new(root, {
				valueField: 'value',
				calculateAggregates: true,
				polygonIdField: 'id'
			})
		);

		// Mostrar meat_chicken_production sobre los países

		polygonSeries.mapPolygons.template.setAll({
			tooltipText: '{name}: {value}',
			toggleKey: 'active',
			interactive: true
		});

		// Crear estados para los polígonos al pasar el mouse y al hacer clic
		polygonSeries.mapPolygons.template.states.create('hover', {
			fill: root.interfaceColors.get('primaryButtonHover')
		});

		polygonSeries.mapPolygons.template.states.create('active', {
			fill: root.interfaceColors.get('primaryButtonHover')
		});

		var previousPolygon;

		// Manejar el evento de activación de un polígono
		polygonSeries.mapPolygons.template.on('active', function (active, target) {
			if (previousPolygon && previousPolygon != target) {
				previousPolygon.set('active', false); // Desactivar el polígono anterior
			}
			if (target.get('active')) {
				polygonSeries.zoomToDataItem(target.dataItem); // Enfocar el mapa en el país seleccionado
			} else {
				chart.goHome(); // Volver al nivel de zoom inicial si se hace clic fuera de un polígono
			}
			previousPolygon = target;
		});

		// Control de zoom
		chart.set('zoomControl', am5map.ZoomControl.new(root, {}));

		// Animar al cargar
		chart.appear(1000, 100);
	}

	onMount(async () => {
		await getGraph1();
		const entity = 'Afghanistan';
		const startYear = 2011;
		const endYear = 2021;
		await createSecondGraph(entity, startYear, endYear);
		await getGraph3();
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/data.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>

	<script src="https://cdn.amcharts.com/lib/5/index.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/percent.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/map.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/geodata/continentsLow.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/geodata/worldLow.js"></script>
</svelte:head>

<div id="container" style="width:100%; height:400px;"></div>
<div id="secondContainer" style="width:100%; height:600px;"></div>

<div class="amcharts-title">Producción de Pollo en el mundo en el año 2001</div>
<div id="amcharts-container"></div>

<style>
	/* Estilo del contenedor del gráfico amCharts */
	#amcharts-container {
		width: 100%;
		height: 500px;
		margin-top: 10px; /* Reducir el margen superior */
		margin-bottom: 20px;
	}

	/* Estilo del título del gráfico amCharts */
	.amcharts-title {
		text-align: center;
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 20px;
		margin-top: 10px; /* Ajustar el margen superior */
	}
</style>
