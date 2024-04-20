<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/data.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		getData();
	});

	let API = 'https://sos2324-20-415018.ew.r.appspot.com/api/v2/food-production';
	let dataAvailable = false;

	async function getData() {
		try {
			const country = "Afghanistan"; // País deseado
			const year = 1961; // Año deseado
			const res = await fetch(`${API}/${country}/${year}`);
			const data = await res.json();
			console.log(`Data received: ${JSON.stringify(data, null, 2)}`);

			if (Object.keys(data).length > 0) {
				dataAvailable = true;
				createGraph(data);
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
				text: `${data.Entity} Production Distribution for Year ${data.Year}`
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
			series: [{
				name: 'Percentage',
				colorByPoint: true,
				data: productionPercentages
			}]
		});
	}
</script>

<div id="container" style="width:100%; height:400px;"></div>
