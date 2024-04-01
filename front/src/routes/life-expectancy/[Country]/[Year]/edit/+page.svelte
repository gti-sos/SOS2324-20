<script>
    import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

    let country = $page.params.Country;
    let year = $page.params.Year;

    let errorMsg = '';


    let lifeExpectancy = {
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

async function loadLifeExpectancy() {
		try {
			let response = await fetch(`${API}?country=${country}&year=${year}`);
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
				errorMsg = '';
				await loadLifeExpectancy();
			} else {
				errorMsg = 'Error editando el dato' + response.statusText;
			}
		} catch (error) {
			console.error(error);
		}
	}

	function handleCountryChange(event) {
		editedLifeExpectancy.country = event.target.value;
	}

	function handleContinentChange(event) {
		editedLifeExpectancy.continent = event.target.value;
	}

	function handleYearChange(event) {
		editedLifeExpectancy.year = Number(event.target.value);
	}

	function handleLifeExpectancyChange(event) {
		editedLifeExpectancy.life_expectancy = Number(event.target.value);
	}

	function handlePopulationChange(event) {
		editedLifeExpectancy.population = Number(event.target.value);
	}

	function handleCo2EmissionsChange(event) {
		editedLifeExpectancy.co2_emissions = Number(event.target.value);
	}

	function handleElectricPowerConsumptionChange(event) {
		editedLifeExpectancy.electric_power_consumption = Number(event.target.value);
	}

	function handleForestAreaChange(event) {
		editedLifeExpectancy.forest_area = Number(event.target.value);
	}

	function handleIndividualsUsingTheInternetChange(event) {
		editedLifeExpectancy.individuals_using_the_internet = Number(event.target.value);
	}

	function handleMilitaryExpenditureChange(event) {
		editedLifeExpectancy.military_expenditure = Number(event.target.value);
	}

	function handlePeoplePracticingOpenDefecationChange(event) {
		editedLifeExpectancy.people_practicing_open_defecation = Number(event.target.value);
	}

	function handlePeopleUsingAtLeastBasicDrinkingWaterServicesChange(event) {
		editedLifeExpectancy.people_using_at_least_basic_drinking_water_services = Number(
			event.target.value
		);
	}

	function handleBeerConsumptionPerCapitaChange(event) {
		editedLifeExpectancy.beer_consumption_per_capita = Number(event.target.value);
	}
</script>
<h1>Editar datos de {country} en {year}</h1>
{#if errorMsg}
    <p>{errorMsg}</p>
{/if}

<div class="container">
<table>
    <tr>
        <th>Country</th>
        <th>Continent</th>
        <th>Year</th>
        <th>Life Expectancy</th>
        <th>Population</th>
        <th>CO2 Emissions</th>
        <th>Electric Power Consumption</th>
        <th>Forest Area</th>
        <th>Individuals Using the Internet</th>
        <th>Military Expenditure</th>
        <th>People Practicing Open Defecation</th>
        <th>People Using at Least Basic Drinking Water Services</th>
        <th>Beer Consumption per Capita</th>
        <th>Action</th>
    </tr>
    {#if lifeExpectancy}
        <tr>
            <td>{lifeExpectancy.country}</td>
            <td><input type="text" value={lifeExpectancy.continent} on:input={handleContinentChange} /></td>
            <td>{lifeExpectancy.year}</td>
            <td><input type="text" value={lifeExpectancy.life_expectancy} on:input={handleLifeExpectancyChange} /></td>
            <td><input type="text" value={lifeExpectancy.population} on:input={handlePopulationChange} /></td>
            <td><input type="text" value={lifeExpectancy.co2_emissions} on:input={handleCo2EmissionsChange} /></td>
            <td><input type="text" value={lifeExpectancy.electric_power_consumption} on:input={handleElectricPowerConsumptionChange} /></td>
            <td><input type="text" value={lifeExpectancy.forest_area} on:input={handleForestAreaChange} /></td>
            <td><input type="text" value={lifeExpectancy.individuals_using_the_internet} on:input={handleIndividualsUsingTheInternetChange} /></td>
            <td><input type="text" value={lifeExpectancy.military_expenditure} on:input={handleMilitaryExpenditureChange} /></td>
            <td><input type="text" value={lifeExpectancy.people_practicing_open_defecation} on:input={handlePeoplePracticingOpenDefecationChange} /></td>
            <td><input type="text" value={lifeExpectancy.people_using_at_least_basic_drinking_water_services} on:input={handlePeopleUsingAtLeastBasicDrinkingWaterServicesChange} /></td>
            <td><input type="text" value={lifeExpectancy.beer_consumption_per_capita} on:input={handleBeerConsumptionPerCapitaChange} /></td>
            <td><button on:click={editLifeExpectancy}>Update</button></td>
        </tr>
    {/if}
</table>
</div>