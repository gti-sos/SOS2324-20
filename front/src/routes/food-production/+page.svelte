<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	//Muestra si está en desarrollo
	let API = '/api/v1/food-production';
	if (dev) {
		API = 'http://localhost:10000/api/v1/food-production';
	}

	let food = [];
	let errorMsg = '';
	let newFood = {
		Entity: 'EntityName',
		Year: 2024,
		rice_production: 0,
		tomatoes_production: 0,
		tea_production: 0,
		potatoes_production: 0,
		cocoa_beans_production: 0,
		meat_chicken_production: 0,
		bananas_production: 0
	};

	function handleEntityChange(event) {
		newFood.Entity = event.target.value;
	}

	function handleYearChange(event) {
		newFood.Year = Number(event.target.value);
	}

	function handleRiceProductionChange(event) {
		newFood.rice_production = Number(event.target.value);
	}

	function handleTomatoesProductionChange(event) {
		newFood.tomatoes_production = Number(event.target.value);
	}

	function handleTeaProductionChange(event) {
		newFood.tea_production = Number(event.target.value);
	}

	function handlePotatoesProductionChange(event) {
		newFood.potatoes_production = Number(event.target.value);
	}

	function handleCocoaBeansProductionChange(event) {
		newFood.cocoa_beans_production = Number(event.target.value);
	}

	function handleMeatChickenProductionChange(event) {
		newFood.meat_chicken_production = Number(event.target.value);
	}

	function handleBananasProductionChange(event) {
		newFood.bananas_production = Number(event.target.value);
	}

	onMount(() => {
		getFood();
	});

	async function getFood() {
		let response = await fetch(API, { method: 'GET' });

		let data = await response.json();
		food = data;
		console.log(data);
	}

	async function deleteFood(entity, year) {
		console.log(`Deleting ${entity} for year ${year}`);

		try {
			let response = await fetch(
				`${API}/country/${encodeURIComponent(entity)}/${encodeURIComponent(year)}`,
				{
					method: 'DELETE'
				}
			);

			if (response.status === 200) {
				console.log('Food deleted');
			} else {
				console.log('Error: ' + response.status);
			}
		} catch (e) {
			console.log('Error: ' + e);
		}
	}

	async function deleteAllFood() {
		console.log(`Deleting all`);

		try {
			let response = await fetch(API + '/', { method: 'DELETE' });

			if (response.status === 200) {
				getFood();
			} else {
				errorMsg = 'code: ' + response.status;
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	async function createFood() {
		try {
			let response = await fetch(API, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newFood, null, 2)
			});

			let status = await response.status;
			console.log(`Creation response status ${status}`);
			if (status === 201) {
				getFood();
			} else {
				errorMsg = 'code: ' + status;
			}
		} catch (e) {
			errorMsg = e;
		}
	}
</script>

<table>
	<thead>
		<tr>
			<th>Entity</th>
			<th>Year</th>
			<th>Rice Production</th>
			<th>Tomatoes Production</th>
			<th>Tea Production</th>
			<th>Potatoes Production</th>
			<th>Cocoa Beans Production</th>
			<th>Meat Chicken Production</th>
			<th>Bananas Production</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><input bind:value={newFood.Entity} on:input={handleEntityChange} /></td>
			<td><input type="text" bind:value={newFood.Year} on:input={handleYearChange} /></td>
			<td
				><input
					type="text"
					bind:value={newFood.rice_production}
					on:input={handleRiceProductionChange}
				/></td
			>
			<td
				><input
					type="text"
					bind:value={newFood.tomatoes_production}
					on:input={handleTomatoesProductionChange}
				/></td
			>
			<td
				><input
					type="text"
					bind:value={newFood.tea_production}
					on:input={handleTeaProductionChange}
				/></td
			>
			<td
				><input
					type="text"
					bind:value={newFood.potatoes_production}
					on:input={handlePotatoesProductionChange}
				/></td
			>
			<td
				><input
					type="text"
					bind:value={newFood.cocoa_beans_production}
					on:input={handleCocoaBeansProductionChange}
				/></td
			>
			<td
				><input
					type="text"
					bind:value={newFood.meat_chicken_production}
					on:input={handleMeatChickenProductionChange}
				/></td
			>
			<td
				><input
					type="text"
					bind:value={newFood.bananas_production}
					on:input={handleBananasProductionChange}
				/></td
			>
		</tr>
	</tbody>
</table>

<ul>
	{#each food as foodItem}
		<li>
			{foodItem.Entity} - {foodItem.Year}
			<button on:click={() => deleteFood(foodItem.Entity, foodItem.Year)}>Delete</button>
		</li>
	{/each}
	<br />
	<br />
	<button on:click={createFood}>Crear Pais</button>
	<button on:click={deleteAllFood}>Borrar lista</button>
</ul>
{#if errorMsg != ''}
	<hr />
	ERROR: {errorMsg}
{/if}
