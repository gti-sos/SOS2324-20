<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script>
	import { onMount } from 'svelte';

    async function fillChart() {
        const response = await fetch('http://localhost:3000/api/graphFSP');
        const data = await response.json();
        console.log(data);
    }

	onMount(() => {
		const chart = Highcharts.chart('container', {
			chart: {
				type: 'bar'
			},
			title: {
				text: 'Fruit Consumption'
			},
			xAxis: {
				categories: ['Apples', 'Bananas', 'Oranges']
			},
			yAxis: {
				title: {
					text: 'Fruit eaten'
				}
			},
			series: [
				{
					name: 'Jane',
					data: [1, 0, 4]
				},
				{
					name: 'John',
					data: [5, 7, 3]
				}
			]
		});
	});
</script>

<div id="container" style="width:100%; height:400px;"></div>
