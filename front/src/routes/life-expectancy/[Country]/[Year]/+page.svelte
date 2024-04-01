<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	let API = '/api/v2/life-expectancy';
	if (dev) {
		API = 'http://localhost:10000/api/v2/life-expectancy';
	}

	onMount(() => {
		loadLifeExpectancy();
	});

	let selectedLifeExpectancy = {
		country: '',
		year: 0,
		continent: '',
		life_expectancy: 0,
		population: 0,
		co2_emissions: 0,
		electric_power_consumption: 0,
		forest_area: 0,
		individuals_using_the_internet: 0,
		military_expenditure: 0,
		people_practicing_open_defecation: 0,
		people_using_at_least_basic_drinking_water_services: 0,
		beer_consumption_per_capita: 0
	};

	let country = $page.params.Country;
	let year = $page.params.Year;

	let errorMsg = '';

	async function loadLifeExpectancy() {
		try {
			let response = await fetch(`${API}/${country}/${year}`);
			if(await fetch(`${API}?country=${country}&year=${year}`).then((res) => res.status) === 404){
			errorMsg = 'No se encontraron datos para el país y año seleccionados';
			selectedLifeExpectancy = null
			return;
			}
			if (response.status === 200) {
				let data = await response.json();
				selectedLifeExpectancy = { ...selectedLifeExpectancy, ...data };
			} else {
				errorMsg = 'Error loading data';
			}
		} catch (error) {
			console.error(error);
		}
	}
</script>
{#if selectedLifeExpectancy === null}
	<h1>{errorMsg}</h1>
{/if}
{#if selectedLifeExpectancy !== null}
<div class="container">
	<div class="column">
		<h1>Esperanza de vida de {country} en {year}</h1>
		<table>
			<tbody>
				<tr>
					<th>Country</th>
					<td>{selectedLifeExpectancy.country}</td>
				</tr>
				<tr>
					<th>Year</th>
					<td>{selectedLifeExpectancy.year}</td>
				</tr>
				<tr>
					<th>Continent</th>
					<td>{selectedLifeExpectancy.continent}</td>
				</tr>
				<tr>
					<th>Life Expectancy</th>
					<td>{selectedLifeExpectancy.life_expectancy}</td>
				</tr>
				<tr>
					<th>Population</th>
					<td>{selectedLifeExpectancy.population}</td>
				</tr>
				<tr>
					<th>CO2 Emissions</th>
					<td>{selectedLifeExpectancy.co2_emissions}</td>
				</tr>
				<tr>
					<th>Electric Power Consumption</th>
					<td>{selectedLifeExpectancy.electric_power_consumption}</td>
				</tr>
				<tr>
					<th>Forest Area</th>
					<td>{selectedLifeExpectancy.forest_area}</td>
				</tr>
				<tr>
					<th>Individuals Using the Internet</th>
					<td>{selectedLifeExpectancy.individuals_using_the_internet}</td>
				</tr>
				<tr>
					<th>Military Expenditure</th>
					<td>{selectedLifeExpectancy.military_expenditure}</td>
				</tr>
				<tr>
					<th>People Practicing Open Defecation</th>
					<td>{selectedLifeExpectancy.people_practicing_open_defecation}</td>
				</tr>
				<tr>
					<th>People Using at Least Basic Drinking Water Services</th>
					<td>{selectedLifeExpectancy.people_using_at_least_basic_drinking_water_services}</td>
				</tr>
				<tr>
					<th>Beer Consumption per Capita</th>
					<td>{selectedLifeExpectancy.beer_consumption_per_capita}</td>
				</tr>
			</tbody>
		</table>
	</div>
	<button><a href="/life-expectancy/{country}/{year}/edit">Editar</a></button>
	<button><a href="/life-expectancy"> Volver atrás</a></button>
</div>
{/if}
<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #ffffff;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
		padding: 20px;
	}

	.column {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	table {
		border-collapse: collapse;
		margin: 0 auto; /* Centra la tabla horizontalmente */
	}

	table,
	th,
	td {
		border: 1px solid black;
		padding: 10px;
		text-align: center; /* Centra el texto en las celdas */
	}

	th {
		background-color: #dddddd;
		color: #333333;
	}

	button {
		margin-top: 20px;
		padding: 10px 20px;
		font-size: 16px;
		background-color: #cccccc;
		color: #333333;
	}
	button:hover {
		background-color: #bbbbbb;
	}
	h1 {
		color: #333333;
	}
</style>
