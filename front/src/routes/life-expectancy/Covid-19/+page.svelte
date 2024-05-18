<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API = '/api/v2/life-expectancy/?year=2020&limit=10000000&offset=0';
	if (dev) {
		API = 'http://localhost:10000' + API;
	}

	let data = [];

	async function all_fetch() {
		let response = await fetch(API);
		data = await response.json();

		const url = 'https://covid-193.p.rapidapi.com/statistics';
		const options = {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': '31006f2b6emsh34cd7c6bde2dd0ep135abbjsn4c2ef8a06b6e',
				'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
			}
		};
		let response2 = await fetch(url, options);
		let data2 = await response2.json();
		data2 = data2.response;

		let i = 0;
		for (let item of data) {
			for (let item2 of data2) {
				if (item.country == item2.country) {
                    if( item2.cases.active != null)
					item.covid = item2.cases.active;
                    else
                    item.covid = 0;
				}
			}
			i++;
		}
		data = [...data];
	}

	async function chart() {
		Highcharts.chart('container', {
			chart: {
				type: 'column'
			},
			title: {
				text: 'Population in thousands vs Covid-19 cases'
			},
			xAxis: {
				categories: data.map((item) => item.country)
			},
			yAxis: {
				title: {
					text: 'Value'
				}
			},
			series: [
				{
					name: 'Population',
					type: 'line',
					data: data.map((item) => item.population / 1000),
					tooltip: {
						valueSuffix: ' people'
					}
				},
				{
					name: 'Covid-19 cases',
					type: 'column',
					data: data.map((item) => item.covid * 2),
					tooltip: {
						valueSuffix: ' cases'
					}
				}
			]
		});
	}

	onMount(async () => {
		await all_fetch();
		await chart();
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<h4>Life Expectancy</h4>
<div id="container"></div>
<div>
	{#each data as item}
		<ul>
			<li>
				Country: {item.country} - Population in thousands: {item.population} - Covid-19 cases actives:
				{item.covid}
			</li>
		</ul>
	{/each}
</div>
