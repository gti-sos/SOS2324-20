<script>
    import { onMount } from 'svelte';

    function fetchData() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(
                    'https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?make=mercedes-benz&year=2001&limit=8',
                    {
                        method: 'GET',
                        headers: {
                            'X-RapidAPI-Key': '019d98fda1mshc0272741fa34a31p16b83djsn206242f33a0c',
                            'X-RapidAPI-Host': 'cars-by-api-ninjas.p.rapidapi.com'
                        }
                    }
                );
                const data = await response.json();
                console.log(`Data received: ${JSON.stringify(data, null, 2)}`);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }

    onMount(async () => {
        try {
            const data = await fetchData();

            // Ordenar los datos de mayor a menor según el valor de "highway_mpg"
            const sortedData = data.sort((a, b) => a.highway_mpg - b.highway_mpg);

            // Obtener los nombres de los modelos y los valores de highway_mpg
            const modelNames = sortedData.map(car => car.model);
            const highwayMPG = sortedData.map(car => car.highway_mpg);

            // Configuración de la gráfica de Highcharts con 3D
            Highcharts.chart('chartdiv', {
                chart: {
                    type: 'pyramid',
                    options3d: {
                        enabled: true,
                        alpha: 10,
                        depth: 50,
                        viewDistance: 50
                    }
                },
                title: {
                    text: 'Gráfica que indica el consumo de gasolina en autopista de los modelos de Mercedes Benz del año 2001'
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b> ({point.y:,.0f})',
                            allowOverlap: true,
                            x: 10,
                            y: -5
                        },
                        width: '60%',
                        height: '80%',
                        center: ['50%', '45%']
                    }
                },
                series: [{
                    name: 'Highway MPG',
                    data: modelNames.map((name, index) => [name, highwayMPG[index]])
                }]
            });

        } catch (error) {
            console.error('Error fetching car data:', error);
        }
    });
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-3d.js"></script> <!-- Añadir Highcharts 3D -->
    <script src="https://code.highcharts.com/modules/data.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://code.highcharts.com/modules/funnel.js"></script> <!-- Agregar el módulo de pirámide (funnel) -->
</svelte:head>

<div id="chartdiv"></div>
