<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import Error from '../+error.svelte';

	//Muestra si está en desarrollo
	let API = '/api/v1/food-production';
	if (dev) {
		API = 'http://localhost:10000/api/v1/food-production';
	}

	let reports = [];
	let errorMsg = '';
	let successMsg = '';
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
		try {
			let response = await fetch(API, {
				method: 'GET'
			});
			let data = await response.json();
			reports = data;
			console.log(data);
		} catch (e) {
			errorMsg = e;
		}
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

			let status = await response.status;
			console.log(`Deletion response status: ${status}`);

			if (status == 200) {
				console.log('País borrado exitosamente');
				getFood();
			} else {
				console.log(`Error eliminando el pais, no existe, status code: ${status}`);
			}
		} catch (e) {
			console.log(`No se pudo eliminar el pais: ${e}`);
		}
	}

	async function deleteAllFood() {
		console.log(`Eliminando todos los alimentos`);

		try {
			let response = await fetch(API, {
				method: 'DELETE'
			});

			let status = await response.status;
			console.log(`Estado de la respuesta de eliminación: ${status}`);

			if (response.status == 200) {
				reports = []
			} else {
				errorMsg = 'Error borrando todos los reportes, código: ' + response.status;
			}
		} catch (e) {
			errorMsg = e;
		}
	}
	function confirmDelete() {
		if (confirm('¿Estás seguro de que quieres eliminar todos los reportes?')) {
			deleteAllFood();
		}
	}

	async function createFood() {
		console.log(`Creating new food`);

		try {
			let response = await fetch(API, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newFood, null, 2)
			});

			let status = await response.status;
			console.log(`Creation response status: ${status}`);

			if (status == 201) {
				getFood();
				console.log('País creado exitosamente');
				successMsg = 'País creado exitosamente';
			} else {
				errorMsg = `Error creando nueva entrada, el país ya existe, código: ${status}`;
				console.log(errorMsg);
			}
		} catch (e) {
			errorMsg = `Error creando nueva entrada: ${e}`;
			console.log(e);
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
	{#each reports as foodItem}
		<li>
			{foodItem.Entity} - {foodItem.Year}
			<button on:click={() => deleteFood(foodItem.Entity, foodItem.Year)}>Delete</button>
		</li>
	{/each}
	<br />
	<br />
	<button on:click={createFood}>Crear Pais</button>
	<button on:click={confirmDelete}>Borrar todos los datos</button>
</ul>
{#if errorMsg}
    <p>{errorMsg}</p>
{/if}
