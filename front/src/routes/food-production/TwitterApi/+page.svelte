<script>
	import { onMount } from 'svelte';

	async function getFollowersForUser(username) {
		const url = `https://twitter-api45.p.rapidapi.com/followers.php?screenname=${username}`;
		const options = {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': '019d98fda1mshc0272741fa34a31p16b83djsn206242f33a0c',
				'X-RapidAPI-Host': 'twitter-api45.p.rapidapi.com'
			}
		};

		try {
			const response = await fetch(url, options);
			const result = await response.json();
			const followersCount = result.followers_count || 'No data available';

			return { username: username, followers: followersCount };
		} catch (error) {
			console.error(`Error fetching followers for ${username}:`, error);
			return { username: username, followers: 'Error fetching followers' };
		}
	}

	onMount(async () => {
		const users = [
			'elonmusk',
			'BarackObama',
			'Cristiano',
			'justinbieber',
			'rihanna',
			'katyperry',
			'narendramodi',
			'taylorswift13',
			'realDonaldTrump',
			'NASA'
		];

		try {
			const followersData = await Promise.all(users.map(getFollowersForUser));

			const usernames = followersData.map((data) => data.username);
			const followers = followersData.map((data) => parseInt(data.followers));

			const chartOptions = {
				chart: {
					type: 'bar' // Cambiar el tipo de gráfico a 'bar' en lugar de 'variwide'
				},
				title: {
					text: 'Comparación de seguidores en Twitter'
				},
				xAxis: {
					categories: usernames
				},
				yAxis: {
					title: {
						text: 'Número de Seguidores'
					}
				},
				series: [
					{
						name: 'Seguidores',
						data: followers,
						tooltip: {
							pointFormat: 'Seguidores: <b>{point.y}</b>'
						}
					}
				]
			};

			Highcharts.chart('chartContainer', chartOptions);
		} catch (error) {
			console.error('Error fetching followers data:', error);
		}
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/data.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<div id="chartContainer"></div>
