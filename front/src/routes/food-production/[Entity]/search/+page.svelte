<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	let API = '/api/v2/food-production';
	if (dev) {
		API = 'http://localhost:10000/api/v2/food-production';
	}

	onMount(() => {
		getSearch();
	});

	let errorMsg = '';
	let country = $page.params.Entity;
	let list_search = [];
	async function getSearch() {
		try {
			let response = await fetch(`${API}?Entity=${country}`);
			if (response.status === 200) {
				let data = await response.json();
                console.log(data);
				list_search = data;
				if (data.length === 0) {
					errorMsg = 'No se encontraron resultados';
				}
			}
		} catch (error) {
			errorMsg = 'Error loading data';
		}
	}

	async function deleteFoodProduction(country, year) {
		console.log(`Deleting ${country} for year ${year}`);

		try {
			let response = await fetch(
				`${API}/country/${encodeURIComponent(country)}/${encodeURIComponent(year)}`,
				{
					method: 'DELETE'
				}
			);
			console.log(`Deletion response status: ${response.status}`);

			if (response.status == 200) {
				console.log('País borrado exitosamente');
				errorMsg = 'País borrado exitosamente';
				getSearch();
			} else {
				console.log(`Error eliminando el pais, no existe, status code: ${response.status}`);
			}
		} catch (e) {
			console.log('Error: ' + e);
		}
	}

	function confirmedelete(country, year) {
		if (confirm('¿Estás seguro de que quieres eliminar ' + country + ' - ' + year + ' ?')) {
			deleteFoodProduction(country, year);
		}
	}
</script>

<div class="container">
	<div class="column">
		<h1>Producción de comida de los países</h1>
		<p>Resultados para {country}</p>
		{#if errorMsg != ''}
			<hr />
			<p class="error-msg">{errorMsg}</p>
		{/if}
		{#if errorMsg== ''}
		<ul class="ul-container">
			{#each list_search as f}
				<ul class="list-item">
					<a href="/food-production/{f.Entity}/{f.Year}">{f.Entity} - {f.Year} &nbsp;</a>
					<div class="buttons">
						<button
							class="button"
							onclick="window.location.href = '/food-production/{f.Entity}/{f.Year}/edit'"
							>Editar</button
						>
						<button class="button" on:click={() => confirmedelete(f.Entity, f.Year)}
							>Borrar</button
						>
					</div>
				</ul>
			{/each}
		</ul>
		{/if}
	</div>
</div>
