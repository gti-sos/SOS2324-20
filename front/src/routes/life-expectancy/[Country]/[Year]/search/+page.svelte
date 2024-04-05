<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	let API = '/api/v2/life-expectancy';
	if (dev) {
		API = 'http://localhost:10000/api/v2/life-expectancy';
	}

	onMount(() => {
		getSearch();
	});

	let errorMsg = '';
	let country = $page.params.Country;
	let year = $page.params.Year;
	let data = '';
	async function getSearch() {
		try {
			let response = await fetch(`${API}?country=${country}&year=${year}`);
			if (response.status === 200) {
				let datas = await response.json();
				data = datas;
				if (datas.length === 0) {
					errorMsg = 'No se encontraron resultados';
				}
			}
			if (response.status === 404) {
				errorMsg = 'No se encontraron resultados';
			}
		} catch (error) {
			errorMsg = 'Error loading data';
		}
	}

	async function deleteLifeExpectancy(country, year) {
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
			deleteLifeExpectancy(country, year);
		}
	}
</script>

<div class="container">
	<div class="column">
		<h1>Esperanza de vida</h1>
		<p>Resultados para {country} - {year}</p>
		{#if errorMsg != ''}
			<hr />
			<p class="error-msg">{errorMsg}</p>
		{/if}
		{#if errorMsg == ''}
		<ul class="ul-container">
			<ul class="list-item">
				<a href="/life-expectancy/{data.country}/{data.year}">{data.country} - {data.year} &nbsp;</a
				>
				<div class="buttons">
					<button
						class="button"
						onclick="windows.location.href = '/life-expectancy/{data.country}/{data.year}/edit'"
						>Editar</button
					>
					<button class="button" on:click={() => confirmedelete(data.country, data.year)}
						>Borrar</button
					>
				</div>
			</ul>
		</ul>
		{/if}
	</div>
</div>
