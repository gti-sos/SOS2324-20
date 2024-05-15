<script>
	import { onMount } from 'svelte';

	let movies = [];
	let loading = true;
	let error = null;

	onMount(async () => {
		try {
			const response = await fetch('https://imdb-top-100-movies.p.rapidapi.com/', {
				method: 'GET',
				headers: {
					'X-RapidAPI-Key': '51b41d9980msh902d9bb00934266p11005fjsne515074019ab',
					'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com'
				}
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();

			movies = data;
			loading = false;

			setTimeout(() => {
				const ratingsData = movies.map((movie) => ({
					year: parseInt(movie.year),
					rating: parseFloat(movie.rating),
					title: movie.title
				}));

				new Morris.Line({
					element: 'chartRatings',
					data: ratingsData,
					xkey: ['year'], // Ahora el eje X representará los ratings
					ykeys: ['rating'], // El eje Y representará los años
					labels: [''], // Etiqueta para el eje Y
					ymin: 10, // Límite mínimo del eje Y
					ymax: 8,
                    xmin: 1931,
                    xmax:2024,
					
					hoverCallback: function (index, options, content, row) {
						return `<div><b>${row.title}</b><br/>Year: ${row.year}, Rating: ${row.rating}</div>`;
					}
				});
			}, 0);
		} catch (err) {
			error = err.message;
		}
	});
</script>

{#if loading}
	<div class="loading">Loading...</div>
{:else if error}
	<div class="error">Error: {error}</div>
{:else}
	<div id="chartRatings" style="height: 250px;"></div>
{/if}

<svelte:head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css" />
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js"></script>
</svelte:head>

<style>
	.loading {
		font-size: 1.5em;
	}
	.error {
		color: red;
	}
</style>
