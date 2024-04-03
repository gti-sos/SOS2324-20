<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	let country = $page.params.Entity;
	let year = $page.params.Year;

	let errorMsg = '';

	let API = '/api/v2/food-production';
	if (dev) {
		API = 'http://localhost:10000/api/v2/food-production';
	}

	let editedFoodProduction = {
		Entity: '',
		Year: 0,
		rice_production: 0,
		tomatoes_production: 0,
		tea_production: 0,
		potatoes_production: 0,
		cocoa_beans_production: 0,
		meat_chicken_production: 0,
		bananas_production: 0
	};

	onMount(() => {
		loadFoodProduction();
	});

	async function loadFoodProduction() {
		try {
			let response = await fetch(`${API}/${country}/${year}`);
			if (await fetch(`${API}?Entity=${country}&Year=${year}`).then((res) => res.status) === 404) {
				errorMsg = 'No se encontraron datos para el país y año seleccionados';
			}
			if (response.status === 200) {
				let data = await response.json();
				editedFoodProduction = { ...editedFoodProduction, ...data };
			} else {
				errorMsg = 'Error loading data';
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function editFoodProduction() {
		try {
			let response = await fetch(`${API}/country/${country}/${year}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(editedFoodProduction)
			});
			if (response.status === 200) {
				console.log('Food Production edited');
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
						bind:value={editedFoodProduction.Entity}
						on:blur={(e) => (editedFoodProduction.Entity = parseInput(e.target.value, 'string'))}
					/></td
				>
			</tr>
			<tr>
				<th>Year</th>
				<td
					><input
						type="text"
						bind:value={editedFoodProduction.Year}
						on:blur={(e) => (editedFoodProduction.Year = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>Rice Production</th>
				<td
					><input
						type="text"
						bind:value={editedFoodProduction.rice_production}
						on:blur={(e) =>
							(editedFoodProduction.rice_production = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>Tomatoes Production</th>
				<td
					><input
						type="text"
						bind:value={editedFoodProduction.tomatoes_production}
						on:blur={(e) =>
							(editedFoodProduction.tomatoes_production = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>Tea Production</th>
				<td
					><input
						type="text"
						bind:value={editedFoodProduction.tea_production}
						on:blur={(e) =>
							(editedFoodProduction.tea_production = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>Potatoes Production</th>
				<td
					><input
						type="text"
						bind:value={editedFoodProduction.potatoes_production}
						on:blur={(e) =>
							(editedFoodProduction.potatoes_production = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>Cocoa Beans Production</th>
				<td
					><input
						type="text"
						bind:value={editedFoodProduction.cocoa_beans_production}
						on:blur={(e) =>
							(editedFoodProduction.cocoa_beans_production = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>Meat Chicken Production</th>
				<td
					><input
						type="text"
						bind:value={editedFoodProduction.meat_chicken_production}
						on:blur={(e) =>
							(editedFoodProduction.meat_chicken_production = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>Bananas Production</th>
				<td
					><input
						type="text"
						bind:value={editedFoodProduction.bananas_production}
						on:blur={(e) =>
							(editedFoodProduction.bananas_production = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
		</tbody>
	</table>
	<button class="edit-button" on:click={editFoodProduction}> Actualizar datos</button>
	<button class="back-button" onclick="window.location.href = '/food-production/{country}/{year}'"> Volver atrás</button>
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

	.edit-button{
		margin-top: 20px;
		padding: 10px 20px;
		background-color: #00b15e;
		color: #ffffff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.back-button {
		margin-top: 20px;
		padding: 10px 20px;
		background-color: #cccccc;
		color: #333333;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
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
