<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API = '/api/v2/pharmaceutical-drugs-spending';
	if (dev) {
		API = 'http://localhost:10000/api/v2/pharmaceutical-drugs-spending';
	}

	async function fillChart() {
		const response = await fetch(API + '?limit=100&offset=0');
		const data = await response.json();

		const locations = [...new Set(data.map((item) => item.location))];
		const seriesData = [];

		let yearsWithData = [];

		locations.forEach((location) => {
			const locationData = data.filter((item) => item.location === location);
			const locationYearsWithData = [...new Set(locationData.map((item) => item.time))];

			yearsWithData = [...new Set([...yearsWithData, ...locationYearsWithData])];

			const locationSeriesData = yearsWithData.map((year) => {
				const totalSpend = locationData
					.filter((item) => item.time === year)
					.reduce((total, item) => total + item.total_spend, 0);
				return totalSpend !== 0 ? totalSpend : null; // Evitar que se muestre el valor si es cero
			});

			seriesData.push({
				name: location,
				data: locationSeriesData
			});
		});

		Highcharts.chart('container', {
			chart: {
				type: 'bar'
			},
			title: {
				text: 'Total spend en Australia por años',
				align: 'left'
			},
			xAxis: {
				categories: yearsWithData,
				title: {
					text: null
				},
				gridLineWidth: 1,
				lineWidth: 0
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Gasto total de millones de dolares',
					align: 'high'
				},
				labels: {
					overflow: 'justify'
				},
				gridLineWidth: 0
			},
			tooltip: {
				valueSuffix: ' millions'
			},
			plotOptions: {
				bar: {
					borderRadius: '50%',
					dataLabels: {
						enabled: true,
						formatter: function () {
							return this.y !== null ? this.y : ''; // Formatear el valor para evitar mostrar null
						}
					},
					groupPadding: 0.1
				}
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'top',
				x: -40,
				y: 80,
				floating: true,
				borderWidth: 1,
				backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
				shadow: true
			},
			credits: {
				enabled: false
			},
			series: seriesData
		});
	}

	async function fillBubbleChart() {
		const response = await fetch(API + '?limit=100&offset=0');
		const data = await response.json();

		const locations = [...new Set(data.map((item) => item.location))];
		const years = [...new Set(data.map((item) => item.time))];

		const seriesData = [];

		locations.forEach((location) => {
			const locationData = data.filter((item) => item.location === location);

			years.forEach((year) => {
				const pc_healthxp = locationData
					.filter((item) => item.time === year)
					.reduce((total, item) => total + item.pc_healthxp, 0);

				if (pc_healthxp !== 0) {
					seriesData.push({
						name: year,
						value: pc_healthxp,
						location: location,
						color: Highcharts.getOptions().colors[years.indexOf(year)]
					});
				}
			});
		});

		console.log(seriesData);

		Highcharts.chart('columnContainer', {
			chart: {
				type: 'packedbubble',
				height: '100%'
			},
			title: {
				text: 'PC HealthXP de distintos paises por año',
				align: 'left'
			},
			tooltip: {
				useHTML: true,
				pointFormat: '<b>{point.name}:</b> {point.value}<br>{point.location}'
			},
			plotOptions: {
				packedbubble: {
					minSize: '30%',
					maxSize: '120%',
					zMin: 1,
					zMax: 1000,
					layoutAlgorithm: {
						splitSeries: false,
						gravitationalConstant: 0.02
					},
					dataLabels: {
						enabled: true,
						format: '{point.name}: {point.value}<br>{point.location}',
						style: {
							color: 'black',
							textOutline: 'none',
							fontWeight: 'normal',
							fontSize: '16px'
						}
					}
				}
			},
			series: [
				{
					data: seriesData
				}
			]
		});
	}

	onMount(async () => {
		await fillChart();
		setTimeout(fillBubbleChart, 1000); // Espera 1 segundo antes de cargar el segundo gráfico
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
	<script src="https://code.highcharts.com/highcharts-more.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<div id="container"></div>
<div id="columnContainer"></div>
