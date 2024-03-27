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
		console.log(`Deleting ${entity}`);

		try {
			let response = await fetch(`${API}/?Entity=${entity}/?Year=${year}`, {
				method: 'DELETE'
			});

			if (response.status === 200) {
				getFood();
			} else {
				errorMsg = 'code: ' + response.status;
			}
		} catch (e) {
			errorMsg = e;
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
			<td><input bind:value={newFood.Entity} /></td>
			<td><input bind:value={newFood.Year} /></td>
			<td><input bind:value={newFood.rice_production} /></td>
			<td><input bind:value={newFood.tomatoes_production} /></td>
			<td><input bind:value={newFood.tea_production} /></td>
			<td><input bind:value={newFood.potatoes_production} /></td>
			<td><input bind:value={newFood.cocoa_beans_production} /></td>
			<td><input bind:value={newFood.meat_chicken_production} /></td>
			<td><input bind:value={newFood.bananas_production} /></td>
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
