<script>
	import { onMount } from 'svelte';
	import Chart from 'svelte-frappe-charts';
	import { dev } from '$app/environment';

	let API = '/api/v2/life-expectancy';
	if (dev) {
		API = 'http://localhost:10000/api/v2/life-expectancy';
	}
	let data;
	let chartRef;
	async function fillChart() {
		const response = await fetch(API+'?limit=1000000000&offset=0');
		const responseData = await response.json();

		let labels = responseData.map(item => [item.country, item.year]);
		var values = responseData.map(item => item.life_expectancy);
		let datasets = [ 
			{ 
				values: values,
			}
		]

		data = {
			labels: labels,
			datasets: datasets
		};
		
	}
	onMount(async () => {
		await fillChart();
	});
</script>

<h1>Gráfica de barras de FrappeChart de la esperanza de vida de todos los datos de la bd</h1>
<Chart {data} type="bar"/>

