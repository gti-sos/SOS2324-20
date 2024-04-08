<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	let API = '/api/v2/pharmaceutical-drugs-spending';
	if (dev) {
		API = 'http://localhost:10000/api/v2/pharmaceutical-drugs-spending';
	}

	let selectedDrugSpending = null; // Inicializamos selectedDrugSpending como null

	onMount(() => {
		loadDrugsSpending();
	});

	let country = $page.params.Location;
	let year = $page.params.Time;

	let errorMsg = '';

	async function loadDrugsSpending() {
		try {
			let response = await fetch(`${API}?location=${country}&time=${year}`);
			if (response.status === 404) {
				errorMsg = 'No se encontraron datos para el país y año seleccionados';
				selectedDrugSpending = null;
				console.log(selectedDrugSpending);
				return;
			}
			if (response.status === 200) {
				let data = await response.json();
				selectedDrugSpending = data; // Asignamos los datos directamente
				console.log(selectedDrugSpending);
			} else {
				errorMsg = 'Error loading data';
			}
		} catch (error) {
			console.error(error);
		}
	}
</script>

{#if selectedDrugSpending !== null}
	<div class="container">
		<div class="table-container">
			<h1>Informe en {country} sobre el gasto en medicina del año {year}</h1>
			<table>
				<tbody>
					<tr>
						<th>Location</th>
						<td>{selectedDrugSpending[0].location}</td>
					</tr>
					<tr>
						<th>Time</th>
						<td>{selectedDrugSpending[0].time}</td>
					</tr>
					<tr>
						<th>PC Healthxp</th>
						<td>{selectedDrugSpending[0].pc_healthxp}</td>
					</tr>
					<tr>
						<th>PC GDP</th>
						<td>{selectedDrugSpending[0].pc_gdp}</td>
					</tr>
					<tr>
						<th>USD Cap</th>
						<td>{selectedDrugSpending[0].usd_cap}</td>
					</tr>
					<tr>
						<th>Total Spend</th>
						<td>{selectedDrugSpending[0].total_spend}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="button-container">
			<button
				class="edit-button"
				onclick="window.location.href = '/pharmaceutical-drugs-spending/{country}/{year}/edit'"
				>Editar</button
			>
			<button class="back-button" onclick="window.location.href = '/pharmaceutical-drugs-spending'"
				>Volver atrás</button
			>
		</div>
	</div>
{/if}

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f0f0f0;
		padding: 20px;
	}

	.table-container {
		margin-top: 20px;
		width: 80%;
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 10px;
		border: 1px solid #dddddd;
		text-align: left;
	}

	th {
		background-color: #f2f2f2;
	}

	.button-container {
		margin-top: 20px;
	}

	.edit-button,
	.back-button {
		padding: 10px 20px;
		margin-right: 10px;
		background-color: #007bff;
		color: #ffffff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.edit-button:hover,
	.back-button:hover {
		background-color: #0056b3;
	}
</style>
