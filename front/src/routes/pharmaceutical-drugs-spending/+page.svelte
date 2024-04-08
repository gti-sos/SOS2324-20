<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { get } from 'svelte/store';

	//Muestra si está en desarrollo
	/*
	let API = '/api/v1/phamaceutical-drugs-spending';
	if (dev) {
		API = 'http://localhost:10000/api/v1/phamaceutical-drugs-spending';
	}
	*/
	let API = '/api/v2/pharmaceutical-drugs-spending';
	if (dev) {
		API = 'http://localhost:10000/api/v2/pharmaceutical-drugs-spending';
	}
	

	let drugSpending = [];
	let errorMsg = '';
	let newDrugSpending = {
		location: 'LocationName',
		time: 0,
		pc_healthxp: 0,
		pc_gdp: 0,
		usd_cap: 0,
		total_spend: 0
	};

	function handleLocationChange(event) {
		newDrugSpending.location = event.target.value;
	}

	function handleTimeChange(event) {
		newDrugSpending.time = Number(event.target.value);
	}

	function handlePc_healthxpChange(event) {
		newDrugSpending.pc_healthxp = Number(event.target.value);
	}
	function handlePc_gdpChange(event) {
		newDrugSpending.pc_gdp = Number(event.target.value);
	}
	function handleUsd_capChange(event) {
		newDrugSpending.usd_cap = Number(event.target.value);
	}
	function handleTotal_spendChange(event) {
		newDrugSpending.total_spend = Number(event.target.value);
	}

	onMount(() => {
		getDrugSpending();
		getMax();
	});

	let pagina = 1;
	let max = 0;
	var restantes = 0;

	async function getMax() {
		try {
			let response = await fetch(`${API}/`, { method: 'GET' });
			max = await response.json();
			restantes = max - pagina * 10;
		} catch (e) {
			max = 0;
		}
	}

	async function getDrugSpending() {
		try {
			let limit = 10;
			let offset = (pagina - 1) * limit;
			let response = await fetch(`${API}/?offset=${offset}&limit=${limit}`, { method: 'GET' });
			let data = await response.json();
			if (data != null) {
				drugSpending = data;
			} else {
				drugSpending = [];
			}
		} catch (e) {
			drugSpending = [];
		}
	}

	async function deleteDrugSpending(location, time) {
		console.log(`Deleting ${location} for year ${time}`);

		try {
			let response = await fetch(
				`${API}/country/${encodeURIComponent(location)}/${encodeURIComponent(time)}`,
				{
					method: 'DELETE'
				}
			);
			console.log(`Deletion response status: ${response.status}`);

			if (response.status == 200) {
				console.log('País borrado exitosamente');
				errorMsg = 'País borrado exitosamente';
				getDrugSpending();
				getMax();
			} else {
				console.log(`Error eliminando el pais, no existe, status code: ${response.status}`);
			}
		} catch (e) {
			console.log('Error: ' + e);
		}
	}

	async function deleteAllDrugSpending() {
		console.log(`Deleting all`);

		try {
			let response = await fetch(API + '/', { method: 'DELETE' });

			if (response.status == 200) {
				errorMsg = 'Todos los datos han sido borrados exitosamente';
				location.reload();
				getDrugSpending();
				getMax();
			} else {
				errorMsg = 'code' + response.status;
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	async function createDrugSpending() {
		try {
			let response = await fetch(API, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newDrugSpending, null, 2)
			});
			let status = await response.status;
			console.log(`Creation response: ${status}`);
			if (status == 201) {
				console.log(newDrugSpending);
				errorMsg = 'Dato creado exitosamente';
				getDrugSpending();
				getMax();
			} else if (status == 409) {
				errorMsg = 'El dato ya existe';
			} else {
				errorMsg = 'code' + response.status;
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	async function loadinitial() {
		try {
			let response = await fetch(API + '/loadInitialData', { method: 'GET' });
			let status = await response.status;
			console.log(`Creation response: ${status}`);
			if (status == 201) {
				getDrugSpending();
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

	function confirmDeleteAll() {
		if (confirm('¿Estás seguro de que quieres eliminar todos los datos?')) {
			deleteAllDrugSpending();
			alert('Todos los datos han sido borrados exitosamente');
		}
	}

	function confirmDelete(location, time) {
		if (confirm('¿Estás seguro de que quieres eliminar ' + location + ' - ' + time + ' ?')) {
			deleteDrugSpending(location, time);
		}
	}

	let inputLocation = '';
	let inputTime = '';
</script>

<div class="header">
	<button class="load-data" on:click={confirmload}>Cargar datos iniciales</button>
	<div class="search">
		<p>Para realizar la búsqueda, ingrese un valor con la primera letra en Mayúsculas</p>
		<input type="text" bind:value={inputLocation} placeholder="Spain" />
		<input type="text" bind:value={inputTime} placeholder="2020" />
		{#if inputTime != '' && inputLocation != ''}
			<button
				onclick="window.location.href='/pharmaceutical-drugs-spending/{inputLocation}/{inputTime}/search'"
				>Buscar</button
			>
		{/if}
		{#if inputTime == ''}
			<button onclick="window.location.href='/pharmaceutical-drugs-spending/{inputLocation}/search'"
				>Buscar</button
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
			<button class="delete-button" on:click={confirmDeleteAll}>Borrar lista</button>
		</div>

		<ul class="ul-container">
			{#each drugSpending as drug}
				<ul class="list-item">
					<a href="/pharmaceutical-drugs-spending/{drug.location}/{drug.time}"
						>{drug.location} - {drug.time} &nbsp;</a
					>
					<div class="buttons">
						<button
							class="edit-button"
							onclick="window.location.href = '/pharmaceutical-drugs-spending/{drug.location}/{drug.time}/edit'"
						>
							Editar
						</button>
						<button class="delete-button" on:click={() => confirmDelete(drug.location, drug.time)}
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
						getDrugSpending();
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
						getDrugSpending();
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
				<button on:click={createDrugSpending} class="create-button">Crear Dato</button>
			</div>
			<table>
				<tbody>
					<tr>
						<th>Location</th>
						<td
							><input
								type="text"
								bind:value={newDrugSpending.location}
								on:input={handleLocationChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>Time</th>
						<td
							><input
								type="text"
								bind:value={newDrugSpending.time}
								on:input={handleTimeChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>pc_healthxp</th>
						<td
							><input
								type="text"
								bind:value={newDrugSpending.pc_healthxp}
								on:input={handlePc_healthxpChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>pc_gdp</th>
						<td
							><input
								type="text"
								bind:value={newDrugSpending.pc_gdp}
								on:input={handlePc_gdpChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>usd_cap</th>
						<td
							><input
								type="text"
								bind:value={newDrugSpending.usd_cap}
								on:input={handleUsd_capChange}
								class="input-field"
							/></td
						>
					</tr>
					<tr>
						<th>total_spend</th>
						<td
							><input
								type="text"
								bind:value={newDrugSpending.total_spend}
								on:input={handleTotal_spendChange}
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
	.header {
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
