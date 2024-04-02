<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	//Muestra si está en desarrollo
	let API = '/api/v2/life-expectancy';
	if (dev) {
		API = 'http://localhost:10000/api/v2/life-expectancy';
	}

	let lifeExpectancy = [];
	let errorMsg = '';
	let newLifeExpectancy = {
		country: 'CountryName',
		year: 0,
		continent: 'ContinenteName',
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

	function handleCountryChange(event) {
		newLifeExpectancy.country = event.target.value;
	}

	function handleContinentChange(event) {
		newLifeExpectancy.continent = event.target.value;
	}

	function handleYearChange(event) {
		newLifeExpectancy.year = Number(event.target.value);
	}

	function handleLifeExpectancyChange(event) {
		newLifeExpectancy.life_expectancy = Number(event.target.value);
	}

	function handlePopulationChange(event) {
		newLifeExpectancy.population = Number(event.target.value);
	}

	function handleCo2EmissionsChange(event) {
		newLifeExpectancy.co2_emissions = Number(event.target.value);
	}

	function handleElectricPowerConsumptionChange(event) {
		newLifeExpectancy.electric_power_consumption = Number(event.target.value);
	}

	function handleForestAreaChange(event) {
		newLifeExpectancy.forest_area = Number(event.target.value);
	}

	function handleIndividualsUsingTheInternetChange(event) {
		newLifeExpectancy.individuals_using_the_internet = Number(event.target.value);
	}

	function handleMilitaryExpenditureChange(event) {
		newLifeExpectancy.military_expenditure = Number(event.target.value);
	}

	function handlePeoplePracticingOpenDefecationChange(event) {
		newLifeExpectancy.people_practicing_open_defecation = Number(event.target.value);
	}

	function handlePeopleUsingAtLeastBasicDrinkingWaterServicesChange(event) {
		newLifeExpectancy.people_using_at_least_basic_drinking_water_services = Number(
			event.target.value
		);
	}

	function handleBeerConsumptionPerCapitaChange(event) {
		newLifeExpectancy.beer_consumption_per_capita = Number(event.target.value);
	}

	onMount(() => {
		getLifeExpectancy();
	});

	let pagina = 1;

	async function getLifeExpectancy() {
		try {
			let limit = 10;
			let offset = (pagina - 1) * limit;
			let response = await fetch(`${API}/?offset=${offset}&limit=${limit}`, { method: 'GET' });
			let data = await response.json();
			if (data != null) {
				lifeExpectancy = data;
			} else {
				lifeExpectancy = [];
			}
		} catch (e) {
			lifeExpectancy = [];
		}
	}

	async function deleteLifeExpectancy(country, year) {
		console.log(`Deleting ${country} for year ${year}`);

		try {
			let response = await fetch(
				`${API}/country/${encodeURIComponent(country)}/${encodeURIComponent(year)}`,
				{
					method: 'DELETE'
				}
			);
			console.log(`Deletion response status: ${response.status}`);

			if (response.status == 200) {
				console.log('País borrado exitosamente');
				errorMsg = 'País borrado exitosamente';
				getLifeExpectancy();
			} else {
				console.log(`Error eliminando el pais, no existe, status code: ${response.status}`);
			}
		} catch (e) {
			console.log('Error: ' + e);
		}
	}

	async function deleteAllLifeExpectancy() {
		console.log(`Deleting all`);

		try {
			let response = await fetch(API + '/', { method: 'DELETE' });

			if (response.status == 200) {
				errorMsg = 'Todos los datos han sido borrados exitosamente';
				location.reload();
			} else {
				errorMsg = 'code' + response.status;
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	async function createLifeExpectancy() {
		try {
			let response = await fetch(API, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newLifeExpectancy, null, 2)
			});
			let status = await response.status;
			console.log(`Creation response: ${status}`);
			if (status == 201) {
				console.log(newLifeExpectancy);
				errorMsg = 'Dato creado exitosamente';
				getLifeExpectancy();
			} else {
				errorMsg = 'code' + response.status;
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	async function loadinitial() {
		try {
			let response = await fetch(API + '/loadCSVData', { method: 'GET' });
			let status = await response.status;
			console.log(`Creation response: ${status}`);
			if (status == 201) {
				getLifeExpectancy();
				errorMsg = 'Datos iniciales cargados exitosamente';
			} else if (status == 409) {
				errorMsg = 'Data already exists';
			} else {
				errorMsg = 'code' + response.status;
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	function confirmload() {
		if (confirm('¿Estás seguro de que quieres cargar los datos iniciales?')) {
			loadinitial();
		}
	}

	function confierdeleteall() {
		if (confirm('¿Estás seguro de que quieres eliminar todos los datos?')) {
			deleteAllLifeExpectancy();
		}
	}

	function confirmedelete(country, year) {
		if (confirm('¿Estás seguro de que quieres eliminar ' + country + ' - ' + year + ' ?')) {
			deleteLifeExpectancy(country, year);
		}
	}
</script>

<button class="load-data" on:click={confirmload}>Cargar datos iniciales</button>
{#if errorMsg != ''}
	<hr />
	<p class="error-msg">{errorMsg}</p>
{/if}

<div class="container">
	<div class="column">
		<div class="cabecera">
			<h2>Lista de datos</h2>
			<button class="delete-button" on:click={confierdeleteall}>Borrar lista</button>
		</div>

		<ul>
			{#each lifeExpectancy as life}
				<li class="list-item">
					<a href="/life-expectancy/{life.country}/{life.year}">{life.country} - {life.year}</a>
					<a href="/life-expectancy/{life.country}/{life.year}/edit">
						<button class="edit-button"> Editar </button>
					</a>
					<button class="delete-button" on:click={() => confirmedelete(life.country, life.year)}
						>Borrar</button
					>
				</li>
			{/each}
		</ul>
		<button
			on:click={() => {
				pagina = pagina - 1;
				getLifeExpectancy();
			}}>Anterior</button
		>
		<button
			on:click={() => {
				pagina = pagina + 1;
				getLifeExpectancy();
			}}>Siguiente</button
		>
	</div>
	<div class="column">
		<div class="form-section">
			<div class="cabecera">
				<h2>Crear un nuevo dato</h2>
				<button on:click={createLifeExpectancy} class="create-button">Crear Dato</button>
			</div>
			<table>
				<tbody>
					<tr>
						<th>Country</th>
						<td
							><input
								type="text"
								bind:value={newLifeExpectancy.country}
								on:input={handleCountryChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>Year</th>
						<td
							><input
								type="text"
								bind:value={newLifeExpectancy.year}
								on:input={handleYearChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>Continent</th>
						<td
							><input
								type="text"
								bind:value={newLifeExpectancy.continent}
								on:input={handleContinentChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>Life Expectancy</th>
						<td
							><input
								type="text"
								bind:value={newLifeExpectancy.life_expectancy}
								on:input={handleLifeExpectancyChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>Population</th>
						<td
							><input
								type="text"
								bind:value={newLifeExpectancy.population}
								on:input={handlePopulationChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>CO2 Emissions</th>
						<td
							><input
								type="text"
								bind:value={newLifeExpectancy.co2_emissions}
								on:input={handleCo2EmissionsChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>Electric Power Consumption</th>
						<td
							><input
								type="text"
								bind:value={newLifeExpectancy.electric_power_consumption}
								on:input={handleElectricPowerConsumptionChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>Forest Area</th>
						<td
							><input
								type="text"
								bind:value={newLifeExpectancy.forest_area}
								on:input={handleForestAreaChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>Individuals Using the Internet</th>
						<td
							><input
								type="text"
								bind:value={newLifeExpectancy.individuals_using_internet}
								on:input={handleIndividualsUsingTheInternetChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>Military Expenditure</th>
						<td
							><input
								type="text"
								bind:value={newLifeExpectancy.military_expenditure}
								on:input={handleMilitaryExpenditureChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>People Practicing Open Defecation</th>
						<td
							><input
								type="text"
								bind:value={newLifeExpectancy.open_defecation}
								on:input={handlePeoplePracticingOpenDefecationChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>People Using at Least Basic Drinking Water Services</th>
						<td
							><input
								type="text"
								bind:value={newLifeExpectancy.basic_drinking_water_services}
								on:input={handlePeopleUsingAtLeastBasicDrinkingWaterServicesChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>Beer Consumption per Capita</th>
						<td
							><input
								type="text"
								bind:value={newLifeExpectancy.beer_consumption_per_capita}
								on:input={handleBeerConsumptionPerCapitaChange}
								class="input-field"
							/></td
						>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: space-between;
		padding: 20px;
		background-color: #f4f4f4;
	}

	.column {
		flex: 1;
		margin: 10px;
		padding: 20px;
		background-color: white;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		align-items: center;
	}

	.input-field {
		width: 100%;
		padding: 10px;
		margin-bottom: 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
		box-sizing: border-box;
		transition: border-color 0.3s ease;
	}

	.input-field:focus {
		border-color: #007bff;
	}

	.create-button,
	.delete-button,
	.edit-button,
	.load-data {
		padding: 10px 20px;
		background-color: #cccccc;
		color: #333333;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.create-button:hover,
	.delete-button:hover,
	.edit-button:hover {
		background-color: #bbbbbb;
	}
	.load-data:hover {
		background-color: #007bff;
	}

	.list-item {
		margin-bottom: 10px;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
	}

	.delete-button {
		margin-left: 10px;
		align-self: center;
	}
	.cabecera {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
