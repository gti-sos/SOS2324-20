<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	// URLs de las APIs
	let API1 = '/api/v2/life-expectancy';
	let API2 = '/api/v2/food-production';
	if (dev) {
		API1 = 'http://localhost:10000/api/v2/life-expectancy';
		API2 = 'http://localhost:10000/api/v2/food-production';
	}

	// Función para obtener un color aleatorio
	function getRandomColor() {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	// Función para llenar la gráfica de barras apiladas
	async function fillStackedBarChart() {
		// Realizar las solicitudes a las APIs
		const response1 = await fetch(API1 + '?country=Albania&year=2000');
		const response2 = await fetch(API2 + '?Entity=Afghanistan&Year=1970');

		// Obtener los datos de las respuestas
		const data1 = await response1.json();
		console.log("datos1",data1);
		console.log("data1[0]",data1[0]);
		const data2 = await response2.json();
		console.log("datos2",data2);
		//console.log(data2[0].meat_chicken_production);
		// Crear la gráfica
		Highcharts.chart('stackedBarContainer', {
			chart: {
				type: 'bar'
			},
			title: {
				text: 'Comparación de Life Expectancy en Albania y Meat Chicken Production en Afghanistan'
			},
			xAxis: {
				categories: ['Albania', 'Afghanistan']
			},
			yAxis: {
				title: {
					text: 'Valor'
				}
			},
			plotOptions: {
				series: {
					stacking: 'normal'
				}
			},
			series: [
				{
					name: 'Comparación',
					data: [data1.life_expectancy, data2.meat_chicken_production],
					color: getRandomColor()
				}
			]
		});
	}

	onMount(async () => {
		await fillStackedBarChart();
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<div id="stackedBarContainer"></div>
