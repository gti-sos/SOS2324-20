<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	// URLs de las APIs
	let API1 = '/api/v2/life-expectancy';
	let API2 = '/api/v2/food-production';
	let API3 = '/api/v2/pharmaceutical-drugs-spending'
	if (dev) {
		API1 = 'http://localhost:10000/api/v2/life-expectancy';
		API2 = 'http://localhost:10000/api/v2/food-production';
		API3 = 'http://localhost:10000/api/v2/pharmaceutical-drugs-spending';
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
		const response3 = await fetch(API3 + '?location=AUS&time=1977');


		// Obtener los datos de las respuestas
		const data1 = await response1.json();
		console.log("datos1",data1);
		console.log("data1[0]",data1[0]);
		const data2 = await response2.json();
		console.log("datos2",data2);
		const data3 = await response3.json();
		console.log("datos3",data3);
		//console.log(data2[0].meat_chicken_production);
		// Crear la gráfica
		Highcharts.chart('stackedBarContainer', {
			chart: {
				type: 'bar'
			},
			title: {
				text: 'Comparación de Life Expectancy en Albania, Meat Chicken Production en Afghanistan, Gasto total en millones en Sanidad en AUS'
			},
			xAxis: {
				categories: ['Albania', 'Afghanistan', 'Australia'],
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
					data: [data1.beer_consumption_per_capita, data2.meat_chicken_production, data3.total_spend],
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
