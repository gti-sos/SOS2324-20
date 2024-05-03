<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	//import * as am5 from "@amcharts/amcharts5";

	let API = '/api/v3/food-production';
	if (dev) {
		API = 'http://localhost:10000/api/v3/food-production';
	}

	async function getGraph1() {
		try {
			const res = await fetch(API + '?Entity=Afghanistan&Year=2021');
			const data = await res.json();
			console.log(`Data received: ${JSON.stringify(data, null, 2)}`);
			createPieChart(data);
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	function createPieChart(data) {
		const productionData = Object.entries(data).filter(
			([key, value]) => typeof value === 'number' && key !== 'Entity' && key !== 'Year'
		);

		const totalProduction = productionData.reduce((acc, [key, value]) => acc + value, 0);

		const productionPercentages = productionData.map(([key, value]) => ({
			name: key.replace('_production', '').replace('_', ' '),
			y: (value / totalProduction) * 100
		}));

		Highcharts.chart('container', {
			chart: {
				type: 'pie'
			},
			title: {
				text: `Producción distribuida de ${data.Entity} en el año ${data.Year}`
			},
			tooltip: {
				valueSuffix: '%'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						distance: 20,
						format: '{point.name}: {point.percentage:.1f}%'
					}
				}
			},
			series: [
				{
					name: 'Percentage',
					colorByPoint: true,
					data: productionPercentages
				}
			]
		});
	}

	let isCreatingSecondGraph = false;
	async function createSecondGraph(entity, startYear, endYear) {
		if (isCreatingSecondGraph) return; // Si ya se está creando la gráfica, salir de la función
		isCreatingSecondGraph = true; // Marcar que se está creando la gráfica
		try {
			// Array para almacenar los datos de producción de cada año
			let allData = [];

			// Iterar sobre todos los años desde startYear hasta endYear
			for (let year = startYear; year <= endYear; year++) {
				const res = await fetch(`${API}?Entity=${entity}&Year=${year}`);
				const data = await res.json();
				allData.push(data);
			}

			//console.log(`Data received: ${JSON.stringify(allData, null, 2)}`);

			// Crear los datos de la serie para la gráfica
			const years = Array.from(new Set(allData.map((item) => item.Year)));

			const seriesData = Object.keys(allData[0])
				.filter((key) => key !== 'Entity' && key !== 'Year')
				.map((property, index) => ({
					name: property.replace('_production', '').replace('_', ' '), // Cambiar las etiquetas al español
					data: years.map((year) => {
						const yearData = allData.find((item) => item.Year === year);
						return yearData ? yearData[property] : 0; // Mantener la producción en el eje Y
					})
				}));

			// Crear la gráfica de Highcharts
			Highcharts.chart('secondContainer', {
				chart: {
					type: 'areaspline'
				},
				title: {
					text: 'Comparación de Producción en Afghanistan a lo Largo de los Años' // Cambiar título al español
				},
				xAxis: {
					title: {
						text: 'Años' // Cambiar etiqueta del eje X al español
					},
					categories: years // Especificar las etiquetas del eje X como los años
				},
				yAxis: {
					title: {
						text: 'Producción' // Mantener etiqueta del eje Y en inglés
					}
				},
				plotOptions: {
					series: {
						marker: {
							enabled: false // Desactivar los marcadores en los puntos de datos
						}
					}
				},
				series: seriesData
			});
		} finally {
			isCreatingSecondGraph = false; // Reiniciar la bandera después de que se complete la creación de la gráfica
		}
	}

	//Gráfica con amCharts

	async function getGraph3() {
		try {
			const res = await fetch(API + '?Year=2001&limit=10000&offset=0');
			const data = await res.json();
			//console.log(`Data received amCharts: ${JSON.stringify(data, null, 2)}`);

			// Llamar a la función para crear el gráfico de amCharts con los datos recibidos
			createAmchartsGraph(data);
		} catch (error) {
			console.log(`Error fetching data and creating amCharts map: ${error}`);
		}
	}

	// Crear un gráfico de mapa utilizando amcharts
	function createAmchartsGraph(data) {
		// Elemento raíz
		var root = am5.Root.new('amcharts-container');

		// Tema
		root.setThemes([am5themes_Animated.new(root)]);

		// Crear el gráfico de mapa
		var chart = root.container.children.push(am5map.MapChart.new(root, {}));

		// Crear la serie principal de polígonos para los países
		var polygonSeries = chart.series.push(
			am5map.MapPolygonSeries.new(root, {
				geoJSON: am5geodata_worldLow,
				exclude: ['AQ'] // Excluir la Antártida
			})
		);

		const groupedData = data.reduce((acc, item) => {
			if (!acc[item.Entity]) {
				acc[item.Entity] = {
					id: item.Entity,
					name: item.Entity,
					value: 0
				};
			}
			acc[item.Entity].value += item.meat_chicken_production;
			return acc;
		}, {});

		const filteredData = Object.values(groupedData);
		console.log(`FILTERED DATA amCharts: ${JSON.stringify(filteredData, null, 2)}`);

		let valores = [];
		valores = filteredData.map((item) => item.value);
		console.log('VALORES:', valores);

		//lista con los IDs necesarios de cada país
		let filteredData2 = [
			{
				id: 'AF',
				name: 'Afghanistan',
				value: 13120
			},
			{
				id: 'DZ',
				name: 'Algeria',
				value: 236000
			},
			{
				id: 'AL',
				name: 'Albania',
				value: 4000
			},
			{
				id: 'AO',
				name: 'Angola',
				value: 7875
			},
			{
				id: 'AG',
				name: 'Antigua and Barbuda',
				value: 216
			},
			{
				id: 'AR',
				name: 'Argentina',
				value: 749452
			},
			{
				id: 'AM',
				name: 'Armenia',
				value: 4200
			},
			{
				id: 'AU',
				name: 'Australia',
				value: 480544
			},
			{
				id: 'AT',
				name: 'Austria',
				value: 82492
			},
			{
				id: 'AZ',
				name: 'Azerbaijan',
				value: 14900
			},
			{
				id: 'BS',
				name: 'Bahamas',
				value: 8817
			},
			{
				id: 'BD',
				name: 'Bangladesh',
				value: 4931
			},
			{
				id: 'BB',
				name: 'Barbados',
				value: 76300
			},
			{
				id: 'BY',
				name: 'Belarus',
				value: 303
			},
			{
				id: 'BE',
				name: 'Belgium',
				value: 8182
			},
			{
				id: 'BZ',
				name: 'Belize',
				value: 117043
			},
			{
				id: 'BJ',
				name: 'Benin',
				value: 7581
			},
			{
				id: 'BT',
				name: 'Bhutan',
				value: 10960
			},
			{
				id: 'BO',
				name: 'Bolivia',
				value: 177
			},
			{
				id: 'BA',
				name: 'Bosnia and Herzegovina',
				value: 7200
			},
			{
				id: 'BW',
				name: 'Botswana',
				value: 12000
			},
			{
				id: 'BR',
				name: 'Brazil',
				value: 3046
			},
			{
				id: 'BG',
				name: 'Bulgaria',
				value: 4051500
			},
			{
				id: 'BF',
				name: 'Burkina Faso',
				value: 4196
			},
			{
				id: 'BI',
				name: 'Burundi',
				value: 99100
			},
			{
				id: 'KH',
				name: 'Cambodia',
				value: 90720
			},
			{
				id: 'CM',
				name: 'Cameroon',
				value: 6300
			},
			{
				id: 'CA',
				name: 'Canada',
				value: 17000
			},
			{
				id: 'CV',
				name: 'Cape Verde',
				value: 24000
			},
			{
				id: 'CF',
				name: 'Central African Republic',
				value: 560
			},
			{
				id: 'TD',
				name: 'Chad',
				value: 178148
			},
			{
				id: 'CL',
				name: 'Chile',
				value: 56410
			},
			{
				id: 'CN',
				name: 'China',
				value: 4867
			},
			{
				id: 'CO',
				name: 'Colombia',
				value: 5520000
			},
			{
				id: 'KM',
				name: 'Comoros',
				value: 6138644
			},
			{
				id: 'CG',
				name: 'Congo',
				value: 464527
			},
			{
				id: 'CR',
				name: 'Costa Rica',
				value: 480
			},
			{
				id: 'CI',
				name: "Cote d'Ivoire",
				value: 5800
			},
			{
				id: 'HR',
				name: 'Croatia',
				value: 43
			},
			{
				id: 'CU',
				name: 'Cuba',
				value: 2476
			},
			{
				id: 'CY',
				name: 'Cyprus',
				value: 7575
			},
			{
				id: 'CZ',
				name: 'Czechia',
				value: 54335
			},
			{
				id: 'CD',
				name: 'Democratic Republic of the Congo',
				value: 25400
			},
			{
				id: 'DK',
				name: 'Denmark',
				value: 34000
			},
			{
				id: 'DJ',
				name: 'Djibouti',
				value: 33540
			},
			{
				id: 'DM',
				name: 'Dominica',
				value: 28342
			},
			{
				id: 'DO',
				name: 'Dominican Republic',
				value: 141103
			},
			{
				id: 'EC',
				name: 'Ecuador',
				value: 744
			},
			{
				id: 'EG',
				name: 'Egypt',
				value: 66940
			},
			{
				id: 'SV',
				name: 'El Salvador',
				value: 4306
			},
			{
				id: 'GQ',
				name: 'Equatorial Guinea',
				value: 2805
			},
			{
				id: 'ER',
				name: 'Eritrea',
				value: 117600
			},
			{
				id: 'EE',
				name: 'Estonia',
				value: 45226
			},
			{
				id: 'SZ',
				name: 'Eswatini',
				value: 1934
			},
			{
				id: 'ET',
				name: 'Ethiopia',
				value: 37674
			},
			{
				id: 'FJ',
				name: 'Fiji',
				value: 19646
			},
			{
				id: 'FI',
				name: 'Finland',
				value: 1000
			},
			{
				id: 'FR',
				name: 'France',
				value: 27996
			},
			{
				id: 'GA',
				name: 'Gabon',
				value: 2677
			},
			{
				id: 'GM',
				name: 'Gambia',
				value: 1029
			},
			{
				id: 'GE',
				name: 'Georgia',
				value: 200
			},
			{
				id: 'DE',
				name: 'Germany',
				value: 40689
			},
			{
				id: 'GH',
				name: 'Ghana',
				value: 23855
			},
			{
				id: 'GR',
				name: 'Greece',
				value: 13250
			},
			{
				id: 'GD',
				name: 'Grenada',
				value: 2628
			},
			{
				id: 'GT',
				name: 'Guatemala',
				value: 8702
			},
			{
				id: 'GN',
				name: 'Guinea',
				value: 245857
			},
			{
				id: 'GW',
				name: 'Guinea-Bissau',
				value: 4000
			},
			{
				id: 'GY',
				name: 'Guyana',
				value: 214969
			},
			{
				id: 'HT',
				name: 'Haiti',
				value: 20000
			},
			{
				id: 'HN',
				name: 'Honduras',
				value: 112492
			},
			{
				id: 'HU',
				name: 'Hungary',
				value: 93028
			},
			{
				id: 'IS',
				name: 'Iceland',
				value: 103000
			},
			{
				id: 'IN',
				name: 'India',
				value: 11000
			},
			{
				id: 'ID',
				name: 'Indonesia',
				value: 19000
			},
			{
				id: 'IR',
				name: 'Iran',
				value: 1917523
			},
			{
				id: 'IQ',
				name: 'Iraq',
				value: 3000
			},
			{
				id: 'IE',
				name: 'Ireland',
				value: 50000
			},
			{
				id: 'IL',
				name: 'Israel',
				value: 4000
			},
			{
				id: 'IT',
				name: 'Italy',
				value: 37557
			},
			{
				id: 'JM',
				name: 'Jamaica',
				value: 1272
			},
			{
				id: 'JP',
				name: 'Japan',
				value: 15000
			},
			{
				id: 'JO',
				name: 'Jordan',
				value: 400
			},
			{
				id: 'KZ',
				name: 'Kazakhstan',
				value: 2967
			},
			{
				id: 'KE',
				name: 'Kenya',
				value: 396
			},
			{
				id: 'KI',
				name: 'Kiribati',
				value: 19
			},
			{
				id: 'KW',
				name: 'Kuwait',
				value: 2000
			},
			{
				id: 'KG',
				name: 'Kyrgyzstan',
				value: 1999
			},
			{
				id: 'LA',
				name: 'Laos',
				value: 1900
			},
			{
				id: 'LV',
				name: 'Latvia',
				value: 64349
			},
			{
				id: 'LB',
				name: 'Lebanon',
				value: 4164
			},
			{
				id: 'LS',
				name: 'Lesotho',
				value: 4301
			},
			{
				id: 'LR',
				name: 'Liberia',
				value: 111369
			},
			{
				id: 'LY',
				name: 'Libya',
				value: 2078
			},
			{
				id: 'LI',
				name: 'Liechtenstein',
				value: 160
			},
			{
				id: 'LT',
				name: 'Lithuania',
				value: 50000
			},
			{
				id: 'LU',
				name: 'Luxembourg',
				value: 172424
			},
			{
				id: 'MG',
				name: 'Madagascar',
				value: 587041
			},
			{
				id: 'MW',
				name: 'Malawi',
				value: 340000
			},
			{
				id: 'MY',
				name: 'Malaysia',
				value: 2595
			},
			{
				id: 'MV',
				name: 'Maldives',
				value: 2985
			},
			{
				id: 'ML',
				name: 'Mali',
				value: 6795
			},
			{
				id: 'MT',
				name: 'Malta',
				value: 316
			},
			{
				id: 'MH',
				name: 'Marshall Islands',
				value: 7000
			},
			{
				id: 'MR',
				name: 'Mauritania',
				value: 50
			},
			{
				id: 'MU',
				name: 'Mauritius',
				value: 2456
			},
			{
				id: 'MX',
				name: 'Mexico',
				value: 17992
			},
			{
				id: 'FM',
				name: 'Micronesia',
				value: 158
			},
			{
				id: 'MD',
				name: 'Moldova',
				value: 350
			},
			{
				id: 'MC',
				name: 'Monaco',
				value: 26701
			},
			{
				id: 'MN',
				name: 'Mongolia',
				value: 1070
			},
			{
				id: 'ME',
				name: 'Montenegro',
				value: 45592
			},
			{
				id: 'MA',
				name: 'Morocco',
				value: 30820
			},
			{
				id: 'MZ',
				name: 'Mozambique',
				value: 50510
			},
			{
				id: 'MM',
				name: 'Myanmar',
				value: 2055
			},
			{
				id: 'NA',
				name: 'Namibia',
				value: 5108
			},
			{
				id: 'NR',
				name: 'Nauru',
				value: 26
			},
			{
				id: 'NP',
				name: 'Nepal',
				value: 8849
			},
			{
				id: 'NL',
				name: 'Netherlands',
				value: 41226
			},
			{
				id: 'NZ',
				name: 'New Zealand',
				value: 4161
			},
			{
				id: 'NI',
				name: 'Nicaragua',
				value: 130000
			},
			{
				id: 'NE',
				name: 'Niger',
				value: 293
			},
			{
				id: 'NG',
				name: 'Nigeria',
				value: 158003
			},
			{
				id: 'KP',
				name: 'North Korea',
				value: 5460
			},
			{
				id: 'MK',
				name: 'North Macedonia',
				value: 25713
			},
			{
				id: 'NO',
				name: 'Norway',
				value: 32383
			},
			{
				id: 'OM',
				name: 'Oman',
				value: 20446
			},
			{
				id: 'PK',
				name: 'Pakistan',
				value: 8872
			},
			{
				id: 'PW',
				name: 'Palau',
				value: 22
			},
			{
				id: 'PS',
				name: 'Palestine',
				value: 29000
			},
			{
				id: 'PA',
				name: 'Panama',
				value: 11821
			},
			{
				id: 'PG',
				name: 'Papua New Guinea',
				value: 4547
			},
			{
				id: 'PY',
				name: 'Paraguay',
				value: 12406
			},
			{
				id: 'PE',
				name: 'Peru',
				value: 60000
			},
			{
				id: 'PH',
				name: 'Philippines',
				value: 11136
			},
			{
				id: 'PL',
				name: 'Poland',
				value: 94088
			},
			{
				id: 'PT',
				name: 'Portugal',
				value: 15000
			},
			{
				id: 'QA',
				name: 'Qatar',
				value: 1670
			},
			{
				id: 'RO',
				name: 'Romania',
				value: 238400
			},
			{
				id: 'RU',
				name: 'Russia',
				value: 32000
			},
			{
				id: 'RW',
				name: 'Rwanda',
				value: 2879
			},
			{
				id: 'KN',
				name: 'Saint Kitts and Nevis',
				value: 58
			},
			{
				id: 'LC',
				name: 'Saint Lucia',
				value: 619
			},
			{
				id: 'VC',
				name: 'Saint Vincent and the Grenadines',
				value: 620
			},
			{
				id: 'WS',
				name: 'Samoa',
				value: 2821
			},
			{
				id: 'SM',
				name: 'San Marino',
				value: 3338
			},
			{
				id: 'ST',
				name: 'Sao Tome and Principe',
				value: 964
			},
			{
				id: 'SA',
				name: 'Saudi Arabia',
				value: 22278
			},
			{
				id: 'SN',
				name: 'Senegal',
				value: 11415
			},
			{
				id: 'RS',
				name: 'Serbia',
				value: 22498
			},
			{
				id: 'SC',
				name: 'Seychelles',
				value: 1559
			},
			{
				id: 'SL',
				name: 'Sierra Leone',
				value: 76755
			},
			{
				id: 'SG',
				name: 'Singapore',
				value: 50
			},
			{
				id: 'SK',
				name: 'Slovakia',
				value: 15000
			},
			{
				id: 'SI',
				name: 'Slovenia',
				value: 23434
			},
			{
				id: 'SB',
				name: 'Solomon Islands',
				value: 2883
			},
			{
				id: 'SO',
				name: 'Somalia',
				value: 400
			},
			{
				id: 'ZA',
				name: 'South Africa',
				value: 55000
			},
			{
				id: 'KR',
				name: 'South Korea',
				value: 6558
			},
			{
				id: 'SS',
				name: 'South Sudan',
				value: 250
			},
			{
				id: 'ES',
				name: 'Spain',
				value: 505370
			},
			{
				id: 'LK',
				name: 'Sri Lanka',
				value: 6535
			},
			{
				id: 'SD',
				name: 'Sudan',
				value: 2505832
			},
			{
				id: 'SR',
				name: 'Suriname',
				value: 70
			},
			{
				id: 'SE',
				name: 'Sweden',
				value: 449964
			},
			{
				id: 'CH',
				name: 'Switzerland',
				value: 33246
			},
			{
				id: 'SY',
				name: 'Syria',
				value: 856250
			},
			{
				id: 'TW',
				name: 'Taiwan',
				value: 248
			},
			{
				id: 'TJ',
				name: 'Tajikistan',
				value: 224900
			},
			{
				id: 'TZ',
				name: 'Tanzania',
				value: 3098
			},
			{
				id: 'TH',
				name: 'Thailand',
				value: 43173
			},
			{
				id: 'TL',
				name: 'Timor-Leste',
				value: 1487
			},
			{
				id: 'TG',
				name: 'Togo',
				value: 20000
			},
			{
				id: 'TO',
				name: 'Tonga',
				value: 720
			},
			{
				id: 'TT',
				name: 'Trinidad and Tobago',
				value: 1399
			},
			{
				id: 'TN',
				name: 'Tunisia',
				value: 217460
			},
			{
				id: 'TR',
				name: 'Turkey',
				value: 272420
			},
			{
				id: 'TM',
				name: 'Turkmenistan',
				value: 488100
			},
			{
				id: 'TV',
				name: 'Tuvalu',
				value: 26
			},
			{
				id: 'UG',
				name: 'Uganda',
				value: 241550
			},
			{
				id: 'UA',
				name: 'Ukraine',
				value: 341723
			},
			{
				id: 'AE',
				name: 'United Arab Emirates',
				value: 11927
			},
			{
				id: 'GB',
				name: 'United Kingdom',
				value: 312679
			},
			{
				id: 'US',
				name: 'United States',
				value: 1190
			},
			{
				id: 'UY',
				name: 'Uruguay',
				value: 176215
			},
			{
				id: 'UZ',
				name: 'Uzbekistan',
				value: 387500
			},
			{
				id: 'VU',
				name: 'Vanuatu',
				value: 2985
			},
			{
				id: 'VA',
				name: 'Vatican City',
				value: 8261
			},
			{
				id: 'VE',
				name: 'Venezuela',
				value: 916445
			},
			{
				id: 'VN',
				name: 'Vietnam',
				value: 307.16
			},
			{
				id: 'YE',
				name: 'Yemen',
				value: 53000
			},
			{
				id: 'ZM',
				name: 'Zambia',
				value: 122
			},
			{
				id: 'ZW',
				name: 'Zimbabwe',
				value: 386850
			}
		];

		// Asigna los valores acumulados a los polígonos
		polygonSeries.data.setAll(
			filteredData2.map((item) => {
				console.log('ITEM.VALUE', item.value);
				return {
					id: item.id,
					name: item.name,
					value: item.value
				};
			})
		);

		// Mostrar meat_chicken_production sobre los países
		polygonSeries.mapPolygons.template.setAll({
			tooltipText: '{name}: {value}',
			toggleKey: 'active',
			interactive: true
		});

		// Crear estados para los polígonos al pasar el mouse y al hacer clic
		polygonSeries.mapPolygons.template.states.create('hover', {
			fill: root.interfaceColors.get('primaryButtonHover')
		});

		polygonSeries.mapPolygons.template.states.create('active', {
			fill: root.interfaceColors.get('primaryButtonHover')
		});

		var previousPolygon;

		// Manejar el evento de activación de un polígono
		polygonSeries.mapPolygons.template.on('active', function (active, target) {
			if (previousPolygon && previousPolygon != target) {
				previousPolygon.set('active', false); // Desactivar el polígono anterior
			}
			if (target.get('active')) {
				polygonSeries.zoomToDataItem(target.dataItem); // Enfocar el mapa en el país seleccionado
			} else {
				chart.goHome(); // Volver al nivel de zoom inicial si se hace clic fuera de un polígono
			}
			previousPolygon = target;
		});

		// Control de zoom
		chart.set('zoomControl', am5map.ZoomControl.new(root, {}));

		// Animar al cargar
		chart.appear(1000, 100);
	}

	onMount(async () => {
		await getGraph1();
		const entity = 'Afghanistan';
		const startYear = 2011;
		const endYear = 2021;
		await createSecondGraph(entity, startYear, endYear);
		await getGraph3();
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/data.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>

	<script src="https://cdn.amcharts.com/lib/5/index.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/percent.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/map.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/geodata/continentsLow.js"></script>
	<script src="https://cdn.amcharts.com/lib/5/geodata/worldLow.js"></script>
</svelte:head>

<div id="container" style="width:100%; height:400px;"></div>
<div id="secondContainer" style="width:100%; height:600px;"></div>

<div class="amcharts-title">Producción de Pollo en el mundo en el año 2001</div>
<div id="amcharts-container"></div>

<style>
	/* Estilo del contenedor del gráfico amCharts */
	#amcharts-container {
		width: 100%;
		height: 500px;
		margin-top: 10px; /* Reducir el margen superior */
		margin-bottom: 20px;
	}

	/* Estilo del título del gráfico amCharts */
	.amcharts-title {
		text-align: center;
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 20px;
		margin-top: 10px; /* Ajustar el margen superior */
	}
</style>
