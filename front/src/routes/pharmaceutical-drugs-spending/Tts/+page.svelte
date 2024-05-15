<script>
	import { onMount } from 'svelte';

	let data = []; // Array para almacenar los datos obtenidos de la API
	let audioData = {}; // Objeto para almacenar las URLs de audio, indexadas por location y time
	let isLoading = {}; // Objeto para manejar el estado de carga para cada entrada
	let currentPage = 1; // Página actual
	let totalPages = 1; // Total de páginas
	const limit = 10; // Número de resultados por página

	async function fetchData(page) {
		const offset = (page - 1) * limit; // Calcula el desplazamiento basado en la página actual
		try {
			const response = await fetch(
				`http://localhost:10000/api/v2/pharmaceutical-drugs-spending?limit=${limit}&offset=${offset}`
			);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const result = await response.json();
			data = result;
			console.log(data);

			// Inicializa los estados de carga para cada entrada
			data.forEach((entry) => {
				isLoading[`${entry.location}-${entry.time}`] = false;
			});

			// Obtener el total de elementos para calcular el número de páginas
			const countResponse = await fetch(
				'http://localhost:10000/api/v2/pharmaceutical-drugs-spending/sizeDB'
			);
			if (!countResponse.ok) {
				throw new Error('Network response was not ok');
			}
			const totalCount = await countResponse.json();
			totalPages = Math.ceil(totalCount / limit);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	async function generateTTS(entry) {
		const key = `${entry.location}-${entry.time}`;
		isLoading[key] = true;

		const apiKey = '51b41d9980msh902d9bb00934266p11005fjsne515074019ab';
		const apiHost = 'open-ai-text-to-speech1.p.rapidapi.com';
		const text = `Location: ${entry.location}, Time: ${entry.time}, Per Capita Health Expenditure: ${entry.pc_healthxp}, Per Capita GDP: ${entry.pc_gdp}, USD per Capita: ${entry.usd_cap}, Total Spend: ${entry.total_spend}`;

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-RapidAPI-Key': apiKey,
				'X-RapidAPI-Host': apiHost
			},
			body: JSON.stringify({
				model: 'tts-1',
				input: text,
				voice: 'alloy'
			})
		};

		try {
			const response = await fetch(`https://${apiHost}/`, options);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const blob = await response.blob();
			const audioUrl = URL.createObjectURL(blob);
			audioData[key] = audioUrl;
		} catch (error) {
			console.error('Error generating TTS:', error);
		} finally {
			isLoading[key] = false;
		}
	}

	function changePage(newPage) {
		if (newPage > 0 && newPage <= totalPages) {
			currentPage = newPage;
			fetchData(currentPage);
		}
	}

	onMount(() => {
		fetchData(currentPage);
	});
</script>

<h1>Texto a voz:</h1>

{#if data.length > 0}
	{#each data as entry}
		<div>
			<p>Location: {entry.location}, Time: {entry.time}</p>
			<button
				on:click={() => generateTTS(entry)}
				disabled={isLoading[`${entry.location}-${entry.time}`]}
			>
				{#if isLoading[`${entry.location}-${entry.time}`]}
					Generando audio...
				{/if}
				{#if !isLoading[`${entry.location}-${entry.time}`]}
					Generar TTS
				{/if}
			</button>
			{#if audioData[`${entry.location}-${entry.time}`]}
				<audio controls>
					<source src={audioData[`${entry.location}-${entry.time}`]} type="audio/mpeg" />
					Tu navegador no soporta el elemento de audio.
				</audio>
			{/if}
		</div>
		<br />
	{/each}

	<!-- Controles de paginación -->
	<div>
		<button on:click={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
			Anterior
		</button>
		<span>Página {currentPage} de {totalPages}</span>
		<button on:click={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
			Siguiente
		</button>
	</div>
{/if}
