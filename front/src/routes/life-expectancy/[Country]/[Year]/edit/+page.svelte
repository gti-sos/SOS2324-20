<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	let country = $page.params.Country;
	let year = $page.params.Year;
	let errorMsg = '';
	let API = '/api/v1/life-expectancy';
	if (dev) {
		API = 'http://localhost:10000/api/v1/life-expectancy';
	}

	let editedLifeExpectancy = {
		country: '',
		continent: '',
		year: 0,
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

	onMount(() => {
		loadLifeExpectancy();
	});

	async function loadLifeExpectancy() {
		try {
			let response = await fetch(`${API}?country=${country}&year=${year}`);
			if (response.status === 200) {
				let data = await response.json();
				console.log(data);
				editedLifeExpectancy = { ...editedLifeExpectancy, ...data };
			} else {
				errorMsg = 'Error loading data';
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function editLifeExpectancy() {
		try {
			let response = await fetch(`${API}/country/${country}/${year}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(editedLifeExpectancy)
			});
			if (response.status === 200) {
				console.log('Life Expectancy edited');
				errorMsg = 'Dato actualizado correctamente';
			} else {
				errorMsg = 'Error editando el dato' + response.statusText;
			}
		} catch (error) {
			console.error(error);
		}
	}

	function parseInput(value, type) {
		switch (type) {
			case 'number':
				return Number(value);
			case 'string':
				return String(value);
			default:
				return value;
		}
	}
</script>

{#if errorMsg}
	<p>{errorMsg}</p>
{/if}
<div class="container">
	<h1>Editar datos de {country} en {year}</h1>
	<table>
		<tbody>
			<tr>
				<th>Country</th>
				<td
					><input
						type="text"
						bind:value={editedLifeExpectancy.country}
						on:blur={(e) => (editedLifeExpectancy.country = parseInput(e.target.value, 'string'))}
					/></td
				>
			</tr>
			<tr>
				<th>Continent</th>
				<td
					><input
						type="text"
						bind:value={editedLifeExpectancy.continent}
						on:blur={(e) => (editedLifeExpectancy.continent = parseInput(e.target.value, 'string'))}
					/></td
				>
			</tr>
			<tr>
				<th>Year</th>
				<td
					><input
						type="text"
						bind:value={editedLifeExpectancy.year}
						on:blur={(e) => (editedLifeExpectancy.year = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>Life Expectancy</th>
				<td
					><input
						type="text"
						bind:value={editedLifeExpectancy.life_expectancy}
						on:blur={(e) =>
							(editedLifeExpectancy.life_expectancy = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>Population</th>
				<td
					><input
						type="text"
						bind:value={editedLifeExpectancy.population}
						on:blur={(e) =>
							(editedLifeExpectancy.population = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>CO2 Emissions</th>
				<td
					><input
						type="text"
						bind:value={editedLifeExpectancy.co2_emissions}
						on:blur={(e) =>
							(editedLifeExpectancy.co2_emissions = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>Electric Power Consumption</th>
				<td
					><input
						type="text"
						bind:value={editedLifeExpectancy.electric_power_consumption}
						on:blur={(e) =>
							(editedLifeExpectancy.electric_power_consumption = parseInput(
								e.target.value,
								'number'
							))}
					/></td
				>
			</tr>
			<tr>
				<th>Forest Area</th>
				<td
					><input
						type="text"
						bind:value={editedLifeExpectancy.forest_area}
						on:blur={(e) =>
							(editedLifeExpectancy.forest_area = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>Individuals Using The Internet</th>
				<td
					><input
						type="text"
						bind:value={editedLifeExpectancy.individuals_using_the_internet}
						on:blur={(e) =>
							(editedLifeExpectancy.individuals_using_the_internet = parseInput(
								e.target.value,
								'number'
							))}
					/></td
				>
			</tr>
			<tr>
				<th>Military Expenditure</th>
				<td
					><input
						type="text"
						bind:value={editedLifeExpectancy.military_expenditure}
						on:blur={(e) =>
							(editedLifeExpectancy.military_expenditure = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>People Practicing Open Defecation</th>
				<td
					><input
						type="text"
						bind:value={editedLifeExpectancy.people_practicing_open_defecation}
						on:blur={(e) =>
							(editedLifeExpectancy.people_practicing_open_defecation = parseInput(
								e.target.value,
								'number'
							))}
					/></td
				>
			</tr>
			<tr>
				<th>People Using At Least Basic Drinking Water Services</th>
				<td
					><input
						type="text"
						bind:value={editedLifeExpectancy.people_using_at_least_basic_drinking_water_services}
						on:blur={(e) =>
							(editedLifeExpectancy.people_using_at_least_basic_drinking_water_services =
								parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>Beer Consumption Per Capita</th>
				<td
					><input
						type="text"
						bind:value={editedLifeExpectancy.beer_consumption_per_capita}
						on:blur={(e) =>
							(editedLifeExpectancy.beer_consumption_per_capita = parseInput(
								e.target.value,
								'number'
							))}
					/></td
				>
			</tr>
		</tbody>
	</table>
	<button on:click={editLifeExpectancy}> Actualizar datos</button>
	<a href="/life-expectancy/{country}/{year}"><button> Volver atrás</button></a>
</div>

<style>
	table {
		border-collapse: collapse;
		margin: 0 auto;
	}

	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}

	th {
		background-color: #dddddd;
		color: #333333;
	}

	button {
		background-color: #cccccc;
		color: #333333;
		padding: 10px 24px;
		margin: 10px;
		border: none;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		transition-duration: 0.4s;
		cursor: pointer;
	}

	button:hover {
		background-color: #bbbbbb;
	}

	a {
		text-decoration: none;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 80%;
		margin: auto;
		padding: 20px;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
		background-color: #ffffff;
		border-radius: 10px;
	}

	h1 {
		color: #333333;
		margin-bottom: 20px;
	}
</style>
