<script>

import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	//Muestra si está en desarrollo

	let API1 = '/api/v2/life-expectancy';
    let API2 = '/api/v2/food-production';
	if (dev) {
		API1 = 'http://localhost:10000/api/v2/life-expectancy';
        API2 = 'http://localhost:10000/api/v2/food-production';
	}

	async function fillStackedBarChart() {
		// Supongamos que cada miembro del equipo tiene su propia API para obtener sus datos
		const apis = [API1, API2];
		const apiResponse1 = [];
		const apiResponse2 = [];

		for (const api of apis) {
			if (api === API1) {
				const response = await fetch(api + '?continent=Europe&year=2000&limit=100&offset=0');
				apiResponse1.push(await response.json());
			} else {
				const response = await fetch(api + '?limit=100&offset=0');
				apiResponse2.push(await response.json());
			}

			Highcharts.chart('stackedBarContainer', {
				chart: {
					type: 'bar'
				},
				title: {
					text: 'Datos combinados de todos los miembros del equipo'
				},
				xAxis: {
					categories: apiResponse1.map((item) => item.continent) // Asume que todos los miembros tienen los mismos países
				},
				yAxis: {
					title: {
						text: 'Valor total'
					}
				},
				plotOptions: {
					series: {
						stacking: 'normal'
					}
				},
				series: [
					{
						name: 'Consumo de cerveza per cápita',
						data: apiResponse1.map((item) => item.beer_consumption_per_capita),
						color: getRandomColor()
					},
					{
						name: 'Producción de arroz',
						data: apiResponse2.map((item) => item.rice_production),
						color: getRandomColor()
					}
				]
			});
		}
	}
	onMount(async () => {
		await fillStackedBarChart();
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>
<div id="stackedBarContainer"></div>
