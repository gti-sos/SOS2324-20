<script>
	//@ts-nocheck
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Button, Table, Form, FormGroup, Label, Input } from '@sveltestrap/sveltestrap';

	let data = [];
	let data_cause_of_death = [];
	let data_integracion = [];
	let message = 'No hay datos para mostrar.';
	let result = '';

	let API_cause_of_death = '/api/proxy/?url=https://sos2324-21.ew.r.appspot.com/api/v2/cause-of-deaths';

	let API = '/api/v3/food-production';
	if (dev) {
		API = 'http://localhost:10000' + API;
	API_cause_of_death = "http://localhost:10000" + API_cause_of_death;
	}

	//let API = 'http://localhost:10000/api/v3/food-production/proxy_FSP/?url=https://sos2324-21.ew.r.appspot.com/api/v2/cause-of-deaths';
	onMount(async () => {
		await loadChartData();
		//console.log(`Data received: ${JSON.stringify(data_integracion, null, 2)}`);
	});

	async function loadChartData() {
		await loadData();
		const chartData = prepareChartData(data_integracion);
		createChart(chartData);
	}

	async function loadCause() {
		await fetch(API_cause_of_death + '/loadInitialData', {
			method: 'GET'
		});
		await loadData();
		//console.log(`Data received: ${JSON.stringify(data_integracion, null, 2)}`);
	}
	async function loadData() {
		await getData();
		await getData_Cause_death();
		await mixData(); // Llamada a mixData dentro de loadData
	}
	async function mixData() {
		// Crear un objeto para mapear los datos de producción de alimentos por año
		const foodProductionMap = {};
		data.forEach((item) => {
			const key = `${item.Entity}-${item.Year}`;
			foodProductionMap[key] = item;
		});

		// Crear un objeto para mapear los datos de causa de muerte por año
		const causeOfDeathMap = {};
		data_cause_of_death.forEach((item) => {
			const key = `${item.country_name}-${item.year}`;
			causeOfDeathMap[key] = item;
		});

		// Iterar sobre los datos de producción de alimentos y combinar con los datos de causa de muerte
		const integratedData = [];
		Object.keys(foodProductionMap).forEach((foodKey) => {
			const causeKey = foodKey.replace('Eswatini', 'Eswatini').replace('-', '-');
			const foodItem = foodProductionMap[foodKey];
			const causeItem = causeOfDeathMap[causeKey];
			if (causeItem) {
				integratedData.push({
					Entity: foodItem.Entity,
					Year: foodItem.Year,
					rice_production: foodItem.rice_production,
					tea_production: foodItem.tea_production,
					potatoes_production: foodItem.potatoes_production,
					country_name: causeItem.country_name,
					year: causeItem.year,
					nutricional_deficiencie: causeItem.nutricional_deficiencie
				});
			}
		});

		console.log(`Integrated data: ${JSON.stringify(integratedData, null, 2)}`);

		data_integracion = integratedData;
	}

	async function getData() {
		const res = await fetch(API + '?Entity=Eswatini&limit=10000&offset=0', {
			method: 'GET'
		});

		try {
			const dataReceived = await res.json();
			const filteredData = dataReceived.filter((item) => {
				return item.Year >= 2009 && item.Year <= 2019;
			});
			result = JSON.stringify(filteredData, null, 2);
			data = filteredData;
			//console.log(`Data food: ${JSON.stringify(data, null, 2)}`);
		} catch (error) {
			console.log(error);
		}
	}

	async function getData_Cause_death() {
		const res = await fetch(API_cause_of_death + '?country_name=Eswatini&limit=10000&offset=0', {
			method: 'GET'
		});

		try {
			const dataReceived = await res.json();
			const filteredData = dataReceived.filter((item) => {
				return item.year >= 2009 && item.year <= 2019;
			});
			result = JSON.stringify(filteredData, null, 2);
			data_cause_of_death = filteredData;
			//console.log(`Data: ${JSON.stringify(data_cause_of_death, null, 2)}`);
		} catch (error) {
			console.log(error);
		}
	}

	function prepareChartData(data) {
		const chartData = {};
		data.forEach((item) => {
			const year = item.Year;
			if (!chartData[year]) {
				chartData[year] = {
					totalProduction: 0,
					nutricional_deficiencie: item.nutricional_deficiencie // Asigna el valor entero directamente
				};
			}
			// Suma la producción de cada cultivo al total del año
			chartData[year].totalProduction +=
				item.rice_production + item.tea_production + item.potatoes_production;
		});
		console.log(`chartData: ${JSON.stringify(chartData, null, 2)}`);
		return chartData;
	}

	// GRÁFICA DE TIPO COMBINACION
	function createChart(chartData) {
		Highcharts.chart('container', {
			chart: {
				type: 'column'
			},
			title: {
				text: 'Combinación de muertes por deficiencia nutricional en cuanto a producción de alimentos',
				align: 'left'
			},
			xAxis: [
				{
					categories: Object.keys(chartData).map(String),
					crosshair: true,
					title: {
						text: 'Año'
					}
				}
			],
			yAxis: [
				{
					// Primary yAxis
					title: {
						text: 'Deficiencia Nutricional' // Cambiado el título del eje Y
					},
					opposite: true
				},
				{
					// Secondary yAxis
					title: {
						text: 'Producción Total' // Cambiado el título del eje Y
					},
					labels: {
						format: '{value} toneladas' // Agregado el sufijo toneladas para las etiquetas del eje Y
					}
				}
			],
			tooltip: {
				shared: true
			},
			series: [
				{
					name: 'Deficiencia Nutricional',
					type: 'column', // Cambiado el tipo de serie a column
					data: Object.keys(chartData).map((year) => chartData[year].nutricional_deficiencie),
					tooltip: {
						valueSuffix: ' muertes'
					},
					yAxis: 0 // Asignado el eje Y correspondiente
				},
				{
					name: 'Producción Total',
					type: 'spline', // Cambiado el tipo de serie a spline
					data: Object.keys(chartData).map((year) => chartData[year].totalProduction),
					tooltip: {
						valueSuffix: ' toneladas'
					},
					yAxis: 1 // Asignado el eje Y correspondiente
				}
			]
		});
	}
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/data.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
	<h3>Gráfico de Producción Total y Deficiencia Nutricional por Año en Eswatini</h3>
	<div id="container" style="width: 100%; height: 400px;"></div>
	{#if data_integracion.length == 0}
		<Button on:click={loadCause} color="warning">Cargar datos</Button>
	{/if}
</main>
