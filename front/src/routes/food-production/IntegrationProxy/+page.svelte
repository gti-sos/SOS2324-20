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

	let API_cause_of_death = 'https://sos2324-21.ew.r.appspot.com/api/v2/cause-of-deaths';

	let API = '/api/v3/food-production';
	if (dev) {
		API = 'http://localhost:10000' + API;
	}

	//let API = 'http://localhost:10000/api/v3/food-production/proxy_FSP/?url=https://sos2324-21.ew.r.appspot.com/api/v2/cause-of-deaths';
	onMount(async () => {
		await loadData();
		//console.log(`Data received: ${JSON.stringify(data_integracion, null, 2)}`);
	});
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
		//if (data_integracion.length > 0) loadChartData(data_integracion);
	}
		async function mixData() {
			// Crea un objeto para mapear los datos de la causa de muerte por año
			const causeOfDeathMap = {};
			data_cause_of_death.forEach((item) => {
				const key = `${item.country_name}-${item.year}`;
				causeOfDeathMap[key] = item;
			});
			console.log(`Cause of death map: ${JSON.stringify(causeOfDeathMap, null, 2)}`);
			// Itera sobre los datos de producción de alimentos
			data.forEach((item) => {
				const key = `${item.Entity}-${item.Year}`;
				const causeOfDeathItem = causeOfDeathMap[key];
				if (causeOfDeathItem) {
					// Si hay datos de causa de muerte correspondientes, combina la información
					data_integracion.push({
						Entity: item.Entity,
						Year: item.Year,
						rice_production: item.rice_production,
						tomatoes_production: item.tomatoes_production,
						tea_production: item.tea_production,
						potatoes_production: item.potatoes_production,
						country_name: causeOfDeathItem.country_name,
						year: causeOfDeathItem.year,
						nutricional_deficience: causeOfDeathItem.nutricional_deficience
					});
					console.log(causeOfDeathItem.year);
				}
			});

			console.log(`Data received: ${JSON.stringify(data_integracion, null, 2)}`);
		}

	function calculateTotalProduction(data) {
		const totalProduction = {};

		// Itera sobre los datos para calcular el total de producción de cada país
		data.forEach((item) => {
			const country = item.Entity;
			if (!totalProduction[country]) {
				// Si es la primera vez que se encuentra el país, inicializa su total de producción
				totalProduction[country] = {
					rice_production: 0,
					tomatoes_production: 0,
					tea_production: 0,
					potatoes_production: 0
				};
			}

			// Suma la producción de cada cultivo al total del país
			totalProduction[country].rice_production += item.rice_production || 0;
			totalProduction[country].tomatoes_production += item.tomatoes_production || 0;
			totalProduction[country].tea_production += item.tea_production || 0;
			totalProduction[country].potatoes_production += item.potatoes_production || 0;
		});

		return totalProduction;
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
			//console.log(`Data: ${JSON.stringify(data, null, 2)}`);
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

	// Función para crear la gráfica
	function createChart(totalProduction) {
		Highcharts.chart('container', {
			chart: {
				zoomType: 'xy'
			},
			title: {
				text: 'Producción y Deficiencia Nutricional por País'
			},
			xAxis: {
				categories: Object.keys(totalProduction), // Países como categorías del eje X
				crosshair: true
			},
			yAxis: [
				{
					title: {
						text: 'Producción Total'
					}
				},
				{
					title: {
						text: 'Deficiencia Nutricional',
						style: {
							color: Highcharts.getOptions().colors[1]
						}
					},
					opposite: true
				}
			],
			tooltip: {
				shared: true
			},
			series: [
				{
					name: 'Producción de Arroz',
					type: 'column',
					data: Object.values(totalProduction).map((item) => item.rice_production),
					tooltip: {
						valueSuffix: ' toneladas'
					}
				},
				{
					name: 'Producción de Tomates',
					type: 'column',
					data: Object.values(totalProduction).map((item) => item.tomatoes_production),
					tooltip: {
						valueSuffix: ' toneladas'
					}
				},
				{
					name: 'Producción de Té',
					type: 'column',
					data: Object.values(totalProduction).map((item) => item.tea_production),
					tooltip: {
						valueSuffix: ' toneladas'
					}
				},
				{
					name: 'Producción de Papas',
					type: 'column',
					data: Object.values(totalProduction).map((item) => item.potatoes_production),
					tooltip: {
						valueSuffix: ' toneladas'
					}
				},
				{
					name: 'Deficiencia Nutricional',
					type: 'spline',
					yAxis: 1,
					data: Object.values(totalProduction).map((item) => item.nutricional_deficience),
					tooltip: {
						valueSuffix: '%'
					}
				}
			]
		});
	}

	// Llama a la función para crear la gráfica después de cargar los datos
	async function loadChartData() {
		await loadData();
		const totalProduction = calculateTotalProduction(data_integracion);
		//createChart(totalProduction);
	}
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/data.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
	<h3>Gráfico de Producción y Deficiencia Nutricional por País</h3>
	<div id="container" style="width: 100%; height: 400px;"></div>
	{#if data_integracion.length == 0}
		<Button on:click={loadCause} color="warning">Cargar datos</Button>
	{/if}
</main>
