<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	//Muestra si está en desarrollo
	let API = '/api/v2/life-expectancy';
	if (dev) {
		API = 'http://localhost:10000/api/v2/life-expectancy';
	}

    async function fillChart() {
        const response = await fetch(API+'?continent=Europe&year=2000&limit=100&offset=0');
        const data = await response.json();

        Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: 'Esperanza de vida vs Consumo de cerveza per cápita en Europa en el año 2000'
            },
            xAxis: {
                title: {
                    text: 'Consumo de cerveza per cápita'
                },
                tickInterval: 0.5
            },
            yAxis: {
                title: {
                    text: 'Esperanza de vida'
                },
                tickInterval: 5
            },
            series: data.map(item => ({
                name: item.country,
                data: [[item.beer_consumption_per_capita, item.life_expectancy]]
            }))
        });
    }

    function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


    async function fillColumnChart() {
    const response = await fetch(API+'?continent=Europe&year=2000&limit=100&offset=0');
    const data = await response.json();

    const colors = data.map(() => getRandomColor());

    Highcharts.chart('columnContainer', {
        chart: {
            type: 'column'
        },
        colors: colors,
        title: {
            text: 'Consumo de electricidad per cápita en Europa en el año 2000'
        },
        xAxis: {
            categories: data.map(item => item.country),
            title: {
                text: 'País'
            }

        },
        yAxis: {
            title: {
                text: 'Consumo de electricidad per cápita'
            },
            tickInterval: 5
        },
        series: [{
            name: 'Consumo de electricidad per cápita',
             data: data.map(item => ({
                y: item.electric_power_consumption,
                color: getRandomColor()}))
        }]
    });
}

onMount(async () => {
    await fillChart();
    setTimeout(fillColumnChart, 1000); // Espera 1 segundo antes de cargar el segundo gráfico
});

</script>

<div id="container"></div>
<div id="columnContainer"></div>
