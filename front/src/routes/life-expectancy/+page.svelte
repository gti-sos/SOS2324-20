<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	//Muestra si está en desarrollo
	let API = '/api/v1/life-expectancy';
	if (dev) {
		API = 'http://localhost:10000/api/v1/life-expectancy';
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

	async function getLifeExpectancy() {
		let response = await fetch(API, { method: 'GET' });

		let data = await response.json();
		lifeExpectancy = data;
		console.log(data);
	}

	async function deleteLifeExpectancy(country, year) {
		console.log(`Deleting ${country} for year ${year}`);

		try {
			let response = await fetch(`${API}/country/${encodeURIComponent(country)}/${encodeURIComponent(year)}`,
                {
                     method: 'DELETE' 
                }
            );

			if (response.status === 200) {
				console.log('Life deleted');
			} else {
				console.log('Error: ' + response.status);
			}
		} catch (e) {
			console.log('Error: ' + e);
		}
	}

	async function deleteAllLifeExpectancy() {
		console.log(`Deleting all`);

		try {
			let response = await fetch(API + '/', { method: 'DELETE' });

			if (response.status === 200) {
				getLifeExpectancy();
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
				body: JSON.stringify(newLifeExpectancy,null, 2)
			});
            let status = await response.status;
            console.log(`Creation response: ${status}`)
			if (status === 201) {
				getLifeExpectancy();
			} else {
				errorMsg = 'code' + response.status;
			}
		} catch (e) {
			errorMsg = e;
		}
	}
</script>

<table>
	<thead>
		<tr>
			<th>Country</th>
			<th>Year</th>
			<th>Continent</th>
			<th>Life Expectancy</th>
			<th>Population</th>
			<th>CO2 Emissions</th>
			<th>Electric Power Consumption</th>
			<th>Forest Area</th>
			<th>Individuals Using The Internet</th>
			<th>Military Expenditure</th>
			<th>People Practicing Open Defecation</th>
			<th>People Using At Least Basic Drinking Water Services</th>
			<th>Beer Consumption Per Capita</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td
				><input
					type="text"
					bind:value={newLifeExpectancy.country}
					on:input={handleCountryChange}
				/></td
			>
			<td
				><input type="number" bind:value={newLifeExpectancy.year} on:input={handleYearChange} /></td
			>
			<td
				><input
					type="text"
					bind:value={newLifeExpectancy.continent}
					on:input={handleContinentChange}
				/></td
			>
			<td
				><input
					type="number"
					bind:value={newLifeExpectancy.life_expectancy}
					on:input={handleLifeExpectancyChange}
				/></td
			>
			<td
				><input
					type="number"
					bind:value={newLifeExpectancy.population}
					on:input={handlePopulationChange}
				/></td
			>
			<td
				><input
					type="number"
					bind:value={newLifeExpectancy.co2_emissions}
					on:input={handleCo2EmissionsChange}
				/></td
			>
			<td
				><input
					type="number"
					bind:value={newLifeExpectancy.electric_power_consumption}
					on:input={handleElectricPowerConsumptionChange}
				/></td
			>
			<td
				><input
					type="number"
					bind:value={newLifeExpectancy.forest_area}
					on:input={handleForestAreaChange}
				/></td
			>
			<td
				><input
					type="number"
					bind:value={newLifeExpectancy.individuals_using_internet}
					on:input={handleIndividualsUsingTheInternetChange}
				/></td
			>
			<td
				><input
					type="number"
					bind:value={newLifeExpectancy.military_expenditure}
					on:input={handleMilitaryExpenditureChange}
				/></td
			>
			<td
				><input
					type="number"
					bind:value={newLifeExpectancy.open_defecation}
					on:input={handlePeoplePracticingOpenDefecationChange}
				/></td
			>
			<td
				><input
					type="number"
					bind:value={newLifeExpectancy.basic_drinking_water_services}
					on:input={handlePeopleUsingAtLeastBasicDrinkingWaterServicesChange}
				/></td
			>
			<td
				><input
					type="number"
					bind:value={newLifeExpectancy.beer_consumption_per_capita}
					on:input={handleBeerConsumptionPerCapitaChange}
				/></td
			>
		</tr>
	</tbody>
</table>

<ul>
	{#each lifeExpectancy as life}
		<li>
			{life.country} - {life.year} - {life.continent} - {life.life_expectancy} - {life.population} -
			{life.co2_emissions} - {life.electric_power_consumption} - {life.forest_area} - {life.individuals_using_the_internet}
			- {life.military_expenditure} - {life.people_practicing_open_defecation} - {life.people_using_at_least_basic_drinking_water_services}
			- {life.beer_consumption_per_capita}
			<button on:click={() => deleteLifeExpectancy(life.country, life.year)}>Delete</button>
		</li>
	{/each}
	<br />
	<br />
	<button on:click={createLifeExpectancy}>Crear Dato</button>
	<button on:click={deleteAllLifeExpectancy}>Borrar lista</button>
</ul>
{#if errorMsg != ''}
	<hr />
	ERROR: {errorMsg}
{/if}
