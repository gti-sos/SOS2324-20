<script>
	//@ts-nocheck
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let data = []; // Array para almacenar los datos obtenidos de la API
	let captcha = null;
	let captchaInput = '';
	let message = 'Cargando datos...';
	let captchaSolution = '';
	let currentPage = 1; // Página actual
	let totalPages = 1; // Total de páginas
	const itemsPerPage = 10; // Número de resultados por página

	let API_Captcha = '/api/proxy/?url=https://captcha-generator.p.rapidapi.com/';
	let API = '/api/v2/pharmaceutical-drugs-spending';
	let API_Size = '/api/v2/pharmaceutical-drugs-spending/sizeDB';

	if (dev) {
		API = 'http://localhost:10000' + API;
		API_Captcha = 'http://localhost:10000' + API_Captcha;
		API_Size = 'http://localhost:10000' + API_Size;
	}

	onMount(async () => {
		console.log('Componente montado');
		await loadCaptcha();
	});

	async function loadCaptcha() {
		console.log('Cargando captcha...');
		try {
			const response = await fetch(API_Captcha, {
				method: 'GET',
				headers: {
					'X-RapidAPI-Key': '97a67c020dmsh1f8c7878b7d424cp1ad4b9jsn2eb6db4e338d',
					'X-RapidAPI-Host': 'captcha-generator.p.rapidapi.com'
				}
			});
			if (!response.ok) {
				throw new Error(`¡Error HTTP! Estado: ${response.status}`);
			}
			const captchaData = await response.json();
			captcha = captchaData.image_url;
			captchaSolution = captchaData.solution;
			console.log('Captcha cargado:', captcha);
			console.log('Datos del Captcha:', captchaData);
			message = '';
		} catch (error) {
			message = `Error al cargar el captcha: ${error.message}`;
			console.error('Error al cargar el captcha:', error);
		}
	}

	async function submitCaptcha() {
		console.log('Enviando captcha:', captcha);
		if (captchaInput === captchaSolution) {
			await loadData(currentPage);
		} else {
			console.log('La respuesta del captcha es incorrecta');
			message = 'La respuesta del captcha es incorrecta';
			data = null;
		}
	}

	async function loadData(page) {
		console.log('Cargando datos...');
		const offset = (page - 1) * itemsPerPage;
		try {
			const response = await fetch(`${API}?limit=${itemsPerPage}&offset=${offset}`);
			console.log('Obteniendo datos de la API:', `${API}?limit=${itemsPerPage}&offset=${offset}`);
			if (!response.ok) {
				throw new Error(`¡Error HTTP! Estado: ${response.status}`);
			}
			const result = await response.json();
			data = result;
			console.log('Datos cargados:', data);
			message = '';

			// Obtener el total de elementos para calcular el número de páginas
			const countResponse = await fetch(API_Size);
			if (!countResponse.ok) {
				throw new Error(`¡Error HTTP! Estado: ${countResponse.status}`);
			}
			const totalCount = await countResponse.json();
			totalPages = Math.ceil(totalCount / itemsPerPage);
		} catch (error) {
			message = `Error al obtener datos: ${error.message}`;
			console.error('Error al obtener datos:', error);
		}
	}

	function changePage(newPage) {
		if (newPage > 0 && newPage <= totalPages) {
			currentPage = newPage;
			loadData(currentPage);
		}
	}
</script>

<div class="container">
	{#if message}
		<p class="error-msg">{message}</p>
	{/if}

	{#if captcha !== null && message === ''}
		<div class="captcha-container">
			<h2>Resuelve el Captcha</h2>
			<img src={captcha} alt="Captcha" />
			<input
				type="text"
				bind:value={captchaInput}
				placeholder="Introduce la respuesta del captcha"
			/>
			<button on:click={submitCaptcha} class="submit-button">Enviar Captcha</button>
		</div>
	{/if}

	{#if data.length > 0 && message === ''}
		<div class="data-container">
			<h1>Gasto en Medicamentos Farmacéuticos</h1>
			<table>
				<thead>
					<tr>
						{#each Object.keys(data[0]) as key}
							<th>{key}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each data as row}
						<tr>
							{#each Object.values(row) as value}
								<td>{value}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="pagination">
				<button on:click={() => changePage(currentPage - 1)} disabled={currentPage === 1}
					>Anterior</button
				>
				<span>Página {currentPage} de {totalPages}</span>
				<button on:click={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}
					>Siguiente</button
				>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 50px;
	}

	.captcha-container {
		text-align: center;
	}

	.captcha-container img {
		margin-bottom: 20px;
	}

	.captcha-container input {
		margin-bottom: 10px;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		width: 200px;
	}

	.submit-button {
		padding: 10px 20px;
		background-color: #007bff;
		color: #fff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.submit-button:hover {
		background-color: #0056b3;
	}

	.data-container {
		text-align: center;
	}

	.data-container h1 {
		margin-bottom: 20px;
	}

	.error-msg {
		color: red;
		font-weight: bold;
	}

	table {
		border-collapse: collapse;
		width: 100%;
	}

	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}

	th {
		background-color: #f2f2f2;
	}

	.pagination {
		margin-top: 20px;
	}

	.pagination button {
		padding: 8px 16px;
		background-color: #007bff;
		color: #fff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		margin: 0 4px;
		transition: background-color 0.3s ease;
	}

	.pagination button:hover {
		background-color: #0056b3;
	}

	.pagination span {
		padding: 8px 16px;
	}

	.pagination button[disabled] {
		background-color: #ddd;
		color: #666;
		cursor: not-allowed;
	}
</style>
