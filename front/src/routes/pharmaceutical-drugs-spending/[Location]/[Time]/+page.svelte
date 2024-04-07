<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

    let API = '/api/v2/pharmaceutical-drugs-spending';
	if (dev) {
		API = 'http://localhost:10000/api/v2/pharmaceutical-drugs-spending';
	}


	onMount(() => {
		loadDrugsSpending();
	});

	let selectedDrugSpending = {
		location: '',
		time: 0,
		pc_healthxp: 0,
		pc_gdp: 0,
		usd_cap: 0,
		total_spend: 0
	};

	let location = $page.params.location;
	let time = $page.params.time;

	let errorMsg = '';

	async function loadDrugsSpending() {
		try {
			let response = await fetch(`${API}/${location}/${time}`);
			if(await fetch(`${API}?location=${location}&time=${time}`).then((res) => res.status) === 404){
			errorMsg = 'No se encontraron datos para el país y año seleccionados';
			selectedDrugSpending = null
			return;
			}
			if (response.status === 200) {
				let data = await response.json();
				selectedDrugSpending = { ...selectedDrugSpending, ...data };
			} else {
				errorMsg = 'Error loading data';
			}
		} catch (error) {
			console.error(error);
		}
	}
</script>
{#if selectedDrugSpending === null}
	<h1>{errorMsg}</h1>
{/if}
{#if selectedDrugSpending !== null}
<div class="container">
	<div class="column">
		<h1>{location} en {time}</h1>
		<table>
			<tbody>
				<tr>
					<th>location</th>
					<td>{selectedDrugSpending.location}</td>
				</tr>
				<tr>
					<th>time</th>
					<td>{selectedDrugSpending.time}</td>
				</tr>
				<tr>
					<th>pc_healthxp</th>
					<td>{selectedDrugSpending.pc_healthxp}</td>
				</tr>
				<tr>
					<th>pc_gdp</th>
					<td>{selectedDrugSpending.pc_gdp}</td>
				</tr>
				<tr>
					<th>usd_cap</th>
					<td>{selectedDrugSpending.usd_cap}</td>
				</tr>
				<tr>
					<th>total_spend</th>
					<td>{selectedDrugSpending.total_spend}</td>
				</tr>
				
			</tbody>
		</table>
	</div>
	<button class="edit-button" onclick="window.location.href = '/pharmaceutical-drugs-spending/{location}/{time}/edit'">Editar</button>
	<button class="back-button" onclick="window.location.href = '/pharmaceutical-drugs-spending'"> Volver atrás</button>
</div>
{/if}
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
