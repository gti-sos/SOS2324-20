<script>
	import { onMount } from 'svelte';

	let squad = [];
	let loading = true;
	let error = null;
	let topPlayers = [];

	onMount(async () => {
		try {
			const response = await fetch(
				'https://transfermarkt-db.p.rapidapi.com/v1/clubs/squad?season_id=2024&locale=ES&club_id=12321',
				{
					method: 'GET',
					headers: {
						'X-RapidAPI-Key': '97a67c020dmsh1f8c7878b7d424cp1ad4b9jsn2eb6db4e338d',
						'X-RapidAPI-Host': 'transfermarkt-db.p.rapidapi.com'
					}
				}
			);

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const { data } = await response.json();

			console.log('Data from API:', data);

			if (!Array.isArray(data) || data.length === 0) {
				throw new Error('Squad data is not in the expected format');
			}

			squad = data;
			loading = false;

			createChart();
		} catch (err) {
			error = err.message;
			console.error('Error:', error);
		}
	});

	function createChart() {
		const chartData = squad.map((player) => ({
			name: player.name,
			x: parseInt(player.age),
			y: parseFloat(player.marketValue.value)
		}));

		console.log('ChartData:', chartData);

		const sortedPlayers = squad
			.slice()
			.sort((a, b) => parseFloat(b.marketValue.value) - parseFloat(a.marketValue.value));

		// Obtener los tres jugadores con el valor de mercado más alto
		topPlayers = sortedPlayers.slice(0, 3);
		const chartDataTOP = topPlayers.map((player) => ({
			name: player.name,
			x: parseInt(player.age),
			y: parseFloat(player.marketValue.value)
		}));
		console.log('ChartDataTOP:', chartDataTOP);
		console.log('Top Players:', topPlayers);

		Highcharts.chart('chartContainer', {
			title: {
				text: 'Age vs Market Value of Players'
			},
			xAxis: {
				gridLineWidth: 1,
				title: {
					enabled: true,
					text: 'Age'
				},
				startOnTick: true,
				endOnTick: true
			},
			yAxis: {
				title: {
					text: 'Market Value (€)'
				}
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle'
			},
			series: [
				{
					type: 'scatter',
					name: 'Players',
					data: chartData,
					color: Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get(),
					enableMouseTracking: false,
					accessibility: {
						exposeAsGroupOnly: true,
						description:
							'Target ranges in an upwards trending diagonal from ' +
							'161 to 182 on the x axis, and 42 to 100 on the y axis.'
					}
				},
				{
					name: 'Top',
					type: 'polygon',
					color: Highcharts.getOptions().colors[1],
					data: chartDataTOP
				}
			],
			tooltip: {
				headerFormat: '<b>{point.key}</b><br>',
				pointFormat: '{point.x} años, {point.y} euros'
			},
			responsive: {
				rules: [
					{
						condition: {
							maxWidth: 500
						},
						chartOptions: {
							legend: {
								align: 'center',
								layout: 'horizontal',
								verticalAlign: 'bottom'
							}
						}
					}
				]
			}
		});
	}
</script>

<figure class="highcharts-figure">
	<div id="chartContainer"></div>
	<p class="highcharts-description"></p>
</figure>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-more.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

{#if loading}
	<div class="loading">Loading...</div>
{:else if error}
	<div class="error">Error: {error}</div>
{:else}
	<div id="chartContainer" style="min-width: 400px; height: 400px; margin: 0 auto"></div>

	<h1>Squad</h1>
	<ul>
		{#each squad as player}
			<li>{player.name} - {player.age} - {player.marketValue.value}</li>
		{/each}
	</ul>
{/if}

<style>
	.loading {
		font-size: 1.5em;
	}
	.error {
		color: red;
	}
</style>
