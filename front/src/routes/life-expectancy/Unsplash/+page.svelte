<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let message = 'Espera, se estan cargando los datos...';
	let result;

	let API = '/api/v2/life-expectancy/?limit=5&offset=0';
	if (dev) {
		API = 'http://localhost:10000' + API;
	}

	let lista = [];
	async function fetchdata() {
		let response = await fetch(API);
		let data = await response.json();
		result = data;

		for (let item of result) {
			item.url = await buscarImagenPais(item.country);
			console.log(item.url);
			lista.push(item);
		}
		lista = [...lista];
	}

	async function buscarImagenPais(pais) {
		const accessKey = 'gf2Q3QnxeFLTYHs0G68pbGNF0f3dQ8neU1eLsuM9ZWs';
		const url = `https://api.unsplash.com/photos/random?query=${pais}&client_id=${accessKey}`;
		const response = await fetch(url);
		const data = await response.json();
		console.log(data.urls.small);
		return data.urls.small;
	}

	onMount(async () => {
		await fetchdata();
	});
</script>

<div class="container">
	<h4>Life Expectancy</h4>
	{#if result}
		<ul>
			{#each lista as item}
				<li>
					<div>
						<span>{item.country}</span>
						<span>{item.year}</span>
					</div>
					<img class="pais" src={item.url} alt={item.country} />
				</li>
			{/each}
		</ul>
	{/if}
</div>
<style>

	h4 {
		text-align: center;
		color: #333;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		margin-bottom: 1em;
		padding: 1em;
		border-radius: 10px;
		background-color: #fff;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.pais {
		width: 8em;
		height: auto;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}
</style>
