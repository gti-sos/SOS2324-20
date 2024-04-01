<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	let API = '/api/v1/food-production';
	if (dev) {
		API = 'http://localhost:10000/api/v1/food-production';
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
			let response = await fetch(`${API}?Entity=${country}&Year=${year}`);
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
	<button><a href="/food-production/{country}/{year}/edit">Editar</a></button>
	<button><a href="/food-production">Volver atrás</a></button>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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
		background-color: #f2f2f2;
	}

	button {
		margin-top: 20px;
		padding: 10px 20px;
		font-size: 16px;
	}
</style>
