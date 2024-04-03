<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	let API = '/api/v2/food-production';
	if (dev) {
		API = 'http://localhost:10000/api/v2/food-production';
	}

	onMount(() => {
		loadFoodProduction();
	});

	let selectedFoodProduction = {
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

	let country = $page.params.Entity;
	let year = $page.params.Year;

	let errorMsg = '';

	async function loadFoodProduction() {
		try {
			let response = await fetch(`${API}/${country}/${year}`);
			if (
				(await fetch(`${API}?Entity=${country}&Year=${year}`).then((res) => res.status)) === 404
			) {
				errorMsg = 'No se encontraron datos para el país y año seleccionados';
				selectedFoodProduction = null;
				return;
			}
			if (response.status === 200) {
				let data = await response.json();
				selectedFoodProduction = { ...selectedFoodProduction, ...data };
			} else {
				errorMsg = 'Error loading data';
			}
		} catch (error) {
			console.error(error);
		}
	}
</script>

{#if selectedFoodProduction === null}
	<h1>{errorMsg}</h1>
{/if}
<div class="container">
	<div class="column">
		<h1>Producción de alimentos de {country} en {year}</h1>
		<table>
			<tbody>
				<tr>
					<th>Entity</th>
					<td>{selectedFoodProduction.Entity}</td>
				</tr>
				<tr>
					<th>Year</th>
					<td>{selectedFoodProduction.Year}</td>
				</tr>
				<tr>
					<th>Rice Production</th>
					<td>{selectedFoodProduction.rice_production}</td>
				</tr>
				<tr>
					<th>Tomatoes Production</th>
					<td>{selectedFoodProduction.tomatoes_production}</td>
				</tr>
				<tr>
					<th>Tea Production</th>
					<td>{selectedFoodProduction.tea_production}</td>
				</tr>
				<tr>
					<th>Potatoes Production</th>
					<td>{selectedFoodProduction.potatoes_production}</td>
				</tr>
				<tr>
					<th>Cocoa Beans Production</th>
					<td>{selectedFoodProduction.cocoa_beans_production}</td>
				</tr>
				<tr>
					<th>Meat Chicken Production</th>
					<td>{selectedFoodProduction.meat_chicken_production}</td>
				</tr>
				<tr>
					<th>Bananas Production</th>
					<td>{selectedFoodProduction.bananas_production}</td>
				</tr>
			</tbody>
		</table>
	</div>
	<button class="edit-button" onclick="window.location.href = '/food-production/{country}/{year}/edit'">Editar</button>
	<button class="back-button" onclick="window.location.href = '/food-production'"> Volver atrás</button>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #ffffff;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
		padding: 20px;
	}

	.column {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	table {
		border-collapse: collapse;
		margin: 0 auto; /* Centra la tabla horizontalmente */
	}

	table,
	th,
	td {
		border: 1px solid black;
		padding: 10px;
		text-align: center; /* Centra el texto en las celdas */
	}

	th {
		background-color: #dddddd;
		color: #333333;
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

	.edit-button {
		margin-top: 20px;
		padding: 10px 20px;
		background-color: #00b15e;
		color: #ffffff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.edit-button:hover {
		background-color: #006435;
	}
	button:hover {
		background-color: #bbbbbb;
	}
	h1 {
		color: #333333;
	}
</style>
