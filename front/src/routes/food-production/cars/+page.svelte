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

            const root = am5.Root.new('chartdiv');

            root.setThemes([am5themes_Animated.new(root)]);

            const chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                    panX: true,
                    panY: true,
                    wheelY: "zoomXY",
                    pinchZoomX: true,
                    pinchZoomY: true
                })
            );

            chart.get('colors').set('step', 2);

            let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
                tooltip: am5.Tooltip.new(root, {})
            }));

            let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
                tooltip: am5.Tooltip.new(root, {})
            }));

            let series = chart.series.push(am5xy.LineSeries.new(root, {
                calculateAggregates: true,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: 'city_mpg',
                valueXField: 'highway_mpg',
                valueField: 'combination_mpg',
                tooltip: am5.Tooltip.new(root, {
                    labelText: 'Modelo: {model}, MPG en ciudad: {city_mpg}, MPG en carretera: {highway_mpg}, MPG combinado: {combination_mpg}'
                })
            }));

            let circleTemplate = am5.Template.new({});
            series.bullets.push(function() {
                let graphics = am5.Circle.new(root, {
                    fill: series.get('fill'),
                }, circleTemplate);
                return am5.Bullet.new(root, {
                    sprite: graphics
                });
            });

            series.set('heatRules', [{
                target: circleTemplate,
                min: 3,
                max: 35,
                dataField: 'value',
                key: 'radius'
            }]);

            series.data.setAll(data);

            series.strokes.template.set('strokeOpacity', 0);

            chart.set('cursor', am5xy.XYCursor.new(root, {
                xAxis: xAxis,
                yAxis: yAxis,
                snapToSeries: [series]
            }));

            chart.set('scrollbarX', am5.Scrollbar.new(root, {
                orientation: 'horizontal'
            }));

            chart.set('scrollbarY', am5.Scrollbar.new(root, {
                orientation: 'vertical'
            }));

            series.appear(1000);

            chart.appear(1000, 100);
        } catch (error) {
            console.error('Error fetching car data:', error);
        }
    });
</script>

<svelte:head>
    <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
</svelte:head>

<div id="chartdiv"></div>
