<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import Error from '../+error.svelte';
	import { Button, Col, Row } from '@sveltestrap/sveltestrap';

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
			if (data!=null) {
				reports = data;
			} else {
				reports = [];
			}
		} catch (e) {
				reports = [];
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
			console.log(`Deletion response status: ${response.status}`);

			if (response.status == 200) {
				console.log('País borrado exitosamente');
				getFood();
			} else {
				console.log(`Error eliminando el pais, no existe, status code: ${response.status}`);
			}
		} catch (e) {
			console.log(e);
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
				reports = [];
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

<div class="container">
	<div class="column">
		<ul>
			{#each reports as f}
				<li class="list-item">
					<a href="/food-production/{f.Entity}/{f.Year}">{f.Entity} - {f.Year}</a>
					<a href="/food-production/{f.Entity}/{f.Year}/edit">
						<button> Editar </button>
					</a>
					<button class="delete-button" on:click={() => deleteFood(f.Entity, f.Year)}
						>Eliminar</button
					>
				</li>
			{/each}
			<button on:click={confirmDelete}>Borrar todos los datos</button>
		</ul>
	</div>
	<div class="column">
		<div class="form-section">
			<div class="cabecera">
				<h2>Crear un nuevo dato</h2>
				<button on:click={createFood} class="create-button">Crear Dato</button>
			</div>

			<table>
				<tbody>
					<tr>
						<th>Entity</th>
						<td
							><input
								type="text"
								bind:value={newFood.Entity}
								on:input={handleEntityChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>Year</th>
						<td
							><input
								type="text"
								bind:value={newFood.Year}
								on:input={handleYearChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>Rice Production</th>
						<td
							><input
								type="text"
								bind:value={newFood.rice_production}
								on:input={handleRiceProductionChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>Tomatoes Production</th>
						<td
							><input
								type="text"
								bind:value={newFood.tomatoes_production}
								on:input={handleTomatoesProductionChange}
								class="input-field"
							/></td
						>
					</tr><tr>
						<th>Tea Production</th>
						<td>
							<input
								type="text"
								bind:value={newFood.tea_production}
								on:input={handleTeaProductionChange}
								class="input-field"
							/>
						</td>
					</tr>
					<tr>
						<th>Potatoes Production</th>
						<td>
							<input
								type="text"
								bind:value={newFood.potatoes_production}
								on:input={handlePotatoesProductionChange}
								class="input-field"
							/>
						</td>
					</tr>
					<tr>
						<th>Cocoa Beans Production</th>
						<td>
							<input
								type="text"
								bind:value={newFood.cocoa_beans_production}
								on:input={handleCocoaBeansProductionChange}
								class="input-field"
							/>
						</td>
					</tr>
					<tr>
						<th>Meat Chicken Production</th>
						<td>
							<input
								type="text"
								bind:value={newFood.meat_chicken_production}
								on:input={handleMeatChickenProductionChange}
								class="input-field"
							/>
						</td>
					</tr>
					<tr>
						<th>Bananas Production</th>
						<td>
							<input
								type="text"
								bind:value={newFood.bananas_production}
								on:input={handleBananasProductionChange}
								class="input-field"
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>
{#if errorMsg != ''}
	<hr />
	<p class="error-msg">ERROR: {errorMsg}</p>
{/if}

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
	}

	.form-section {
		margin-top: 20px;
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
	.delete-button {
		padding: 10px 20px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.create-button:hover,
	.delete-button:hover {
		background-color: #0056b3;
	}

	.error-msg {
		color: red;
		margin-top: 10px;
	}

	.list-item {
		margin-bottom: 10px;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
	}

	.delete-button {
		margin-left: 10px;
	}
	.cabecera {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
