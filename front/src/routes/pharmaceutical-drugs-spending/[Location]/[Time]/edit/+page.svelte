<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	let country = $page.params.Location;
	let year = $page.params.Time;
	let errorMsg = '';
	let API = '/api/v2/pharmaceutical-drugs-spending';
	if (dev) {
		API = 'http://localhost:10000/api/v2/pharmaceutical-drugs-spending';
	}

	let editedDrugSpending = {
		location: '',
		time: 0,
		pc_healthxp: 0,
		pc_gdp: 0,
		usd_cap: 0,
		total_spend: 0
	};

	onMount(() => {
		loadDrugsSpending();
	});

	async function loadDrugsSpending() {
		try {
			let response = await fetch(`${API}?location=${country}&time=${year}`);
			if (response.status === 404) {
				errorMsg = 'No se encontraron datos para el país y año seleccionados';
				return;
			}
			if (response.status === 200) {
				let data = await response.json();
				if (Array.isArray(data) && data.length > 0) {
					editedDrugSpending = { ...editedDrugSpending, ...data[0] };
					console.log(editedDrugSpending, null, 2);
				} else {
					errorMsg = 'Datos no válidos';
				}
			} else {
				errorMsg = 'Error loading data';
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function editDrugSpending() {
		try {
			delete editedDrugSpending._id;
			let response = await fetch(`${API}/${country}/${year}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(editedDrugSpending)
			});
			if (response.status === 200) {
				console.log('Drug Spending edited');
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
						bind:value={editedDrugSpending.location}
						on:blur={(e) => (editedDrugSpending.location = parseInput(e.target.value, 'string'))}
					/></td
				>
			</tr>
			<tr>
				<th>Time</th>
				<td
					><input
						type="text"
						bind:value={editedDrugSpending.time}
						on:blur={(e) => (editedDrugSpending.time = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>PC Healthxp</th>
				<td
					><input
						type="text"
						bind:value={editedDrugSpending.pc_healthxp}
						on:blur={(e) => (editedDrugSpending.pc_healthxp = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>PC GDP</th>
				<td
					><input
						type="text"
						bind:value={editedDrugSpending.pc_gdp}
						on:blur={(e) => (editedDrugSpending.pc_gdp = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>USD Cap</th>
				<td
					><input
						type="text"
						bind:value={editedDrugSpending.usd_cap}
						on:blur={(e) => (editedDrugSpending.usd_cap = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
			<tr>
				<th>Total Spend</th>
				<td
					><input
						type="text"
						bind:value={editedDrugSpending.total_spend}
						on:blur={(e) => (editedDrugSpending.total_spend = parseInput(e.target.value, 'number'))}
					/></td
				>
			</tr>
		</tbody>
	</table>
	<button class="edit-button" on:click={editDrugSpending}> Actualizar datos</button>
	<button
		class="back-button"
		onclick="window.location.href = '/pharmaceutical-drugs-spending/{country}/{year}'"
	>
		Volver atrás</button
	>
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
