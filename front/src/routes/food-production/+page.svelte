<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { get } from 'svelte/store';

	//Muestra si está en desarrollo
	let API = '/api/v2/food-production';
	if (dev) {
		API = 'http://localhost:10000/api/v2/food-production';
	}

	let foodProduction = [];
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
		getMax();
	});

	let pagina = 1;
	let max = 0;
	var restantes = 0;

	async function getFood() {
		try {
			let limit = 10;
			let offset = (pagina - 1) * limit;
			let response = await fetch(`${API}/?offset=${offset}&limit=${limit}`, { method: 'GET' });
			let data = await response.json();
			if (data != null) {
				foodProduction = data;
				console.log(foodProduction);
			} else {
				foodProduction = [];
			}
		} catch (e) {
			foodProduction = [];
		}
	}

	async function getMax() {
		try {
			let response = await fetch(`${API}/sizeDB`, { method: 'GET' });
			max = await response.json();
			restantes = max - pagina * 10;
		} catch (e) {
			max = 0;
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
				errorMsg = 'País borrado exitosamente';
				getFood();
				getMax();
			} else {
				console.log(`Error eliminando el pais, no existe, status code: ${response.status}`);
			}
		} catch (e) {
			console.log('Error' + e);
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
				errorMsg = 'Todos los datos han sido eliminados';
				location.reload();
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
				console.log(newFood);
				errorMsg = 'País creado exitosamente';
				getFood();
				getMax();
			} else if (status == 409) {
				errorMsg = `El dato ya existe`;
			} else {
				errorMsg = `Error creando nueva entrada, código: ${status}`;
				console.log(errorMsg);
			}
		} catch (e) {
			errorMsg = `Error creando nueva entrada: ${e}`;
			console.log(e);
		}
	}

	async function loadinitial() {
		try {
			let response = await fetch(API + '/loadInitialData', { method: 'GET' });
			let status = await response.status;
			console.log(`Creation response: ${status}`);
			if (status == 201) {
				getFood();
				getMax();
				errorMsg = 'Datos iniciales cargados exitosamente';
			} else if (status == 409) {
				errorMsg = 'Los datos ya existen';
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

	let inputEntity = '';
	let inputYear = '';
</script>

<div class="header">
	<button class="load-data" on:click={confirmload}>Cargar datos iniciales</button>
	<div class="search">
		<p>Para realizar la búsqueda, ingrese un valor con la primera letra en Mayúsculas</p>
		<input type="text" bind:value={inputEntity} placeholder="Afghanistan" />
		<input type="text" bind:value={inputYear} placeholder="1962" />
		{#if inputYear != '' && inputEntity != ''}
			<button onclick="window.location.href='/food-production/{inputEntity}/{inputYear}/search'"
				>Buscar</button
			>
		{/if}
		{#if inputYear == ''}
			<button onclick="window.location.href='/food-production/{inputEntity}/search'">Buscar</button
			>
		{/if}
	</div>
</div>

{#if errorMsg != ''}
	<hr />
	<p class="error-msg">{errorMsg}</p>
{/if}

<div class="container">
	<div class="column">
		<div class="cabecera">
			<h2>Lista de datos</h2>
			<button class="delete-button" on:click={confirmDelete}>Borrar lista</button>
		</div>

		<ul class="ul-container">
			{#each foodProduction as f}
				<ul class="list-item">
					<a href="/food-production/{f.Entity}/{f.Year}">{f.Entity} - {f.Year} &nbsp</a>
					<div class="buttons">
						<button
							class="edit-button"
							onclick="window.location.href = '/food-production/{f.Entity}/{f.Year}/edit'"
						>
							Editar
						</button>
						<button class="delete-button" on:click={() => deleteFood(f.Entity, f.Year)}
							>Borrar</button
						>
					</div>
				</ul>
			{/each}
		</ul>
		<div class="botonera">
			{#if pagina != 1}
				<button
					class="previous-button"
					on:click={() => {
						pagina = pagina - 1;
						getFood();
						getMax();
					}}>Anterior</button
				>
			{/if}
			{#if max != 0}
				<p>&nbsp; Página &nbsp; {pagina} &nbsp;</p>
			{/if}
			{#if restantes > 0}
				<button
					class="next-button"
					on:click={() => {
						pagina = pagina + 1;
						getFood();
						getMax();
					}}>Siguiente</button
				>
			{/if}
		</div>
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

<style>
	.header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
	}
	.buttons {
		display: flex;
		align-items: center;
	}
	a {
		text-decoration: none;
		color: black;
	}
	a:visited {
		color: black;
	}
	.container {
		display: flex;
		justify-content: space-between;
		padding: 20px;
		background-color: #f4f4f4;
	}
	.botonera {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
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
	.previous-button,
	.next-button {
		padding: 10px 20px;
		background-color: #80ff00;
		color: #333333;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.delete-button {
		padding: 10px 20px;
		background-color: #ff0000;
		color: #ffffff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.edit-button {
		padding: 10px 20px;
		background-color: #00b15e;
		color: #ffffff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.load-data {
		padding: 10px 20px;
		background-color: #007bff;
		color: #ffffff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}
	.delete-button:hover {
		background-color: #b40000;
	}

	.edit-button:hover {
		background-color: #006435;
	}

	.create-button:hover,
	.previous-button:hover,
	.next-button:hover {
		background-color: #218d00;
	}

	.load-data:hover {
		background-color: #005dc0;
	}

	.list-item {
		margin-bottom: 10px;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
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
	ul {
		list-style-type: none;
		padding: 0;
	}
</style>
