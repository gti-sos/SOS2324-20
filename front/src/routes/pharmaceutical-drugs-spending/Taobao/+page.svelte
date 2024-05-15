<script>
	import { onMount } from 'svelte';

	let items = [];
	let loading = false;
	let error = null;
	let imageUrl = '';

	const searchItems = async () => {
		try {
			loading = true;
			const response = await fetch(
				`https://taobao-datahub.p.rapidapi.com/item_search_image?imgUrl=${encodeURIComponent(imageUrl)}&pageSize=10`,
				{
					method: 'GET',
					headers: {
						'X-RapidAPI-Key': '51b41d9980msh902d9bb00934266p11005fjsne515074019ab',
						'X-RapidAPI-Host': 'taobao-datahub.p.rapidapi.com'
					}
				}
			);

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			items = await response.json();
			console.log(items); // Verificar el contenido de items
			loading = false;
			error = null;
		} catch (err) {
			error = err.message || 'Error desconocido';
			loading = false;
			items = [];
			console.error(err); // Log de errores para depuración
		}
	};

	const handleSearch = async () => {
		await searchItems();
	};

	onMount(searchItems); // Llamada a searchItems cuando el componente se monta
</script>

<div>
	<input type="text" bind:value={imageUrl} placeholder="Enter image URL" />
	<button on:click={handleSearch}>Search</button>
</div>

{#if loading}
	<div class="loading">Loading...</div>
{:else if error}
	<div class="error">Error: {error}</div>
{:else}
	<div class="results">
		{#if items.result && items.result.resultList && items.result.resultList.length > 0}
			<ul class="item-list">
				{#each items.result.resultList as { item, delivery, seller }}
					<li class="item">
						{#if item && item.image}
							<img src={item.image} alt={item.title} />
						{:else}
							<p>No image available</p>
						{/if}
						<div class="item-details">
							{#if item && item.title}
								<p><strong>Title:</strong> {item.title}</p>
							{/if}
							{#if item && item.itemUrl}
								<p><strong>Url:</strong> {item.itemUrl}</p>
							{/if}
							{#if item && item.price}
								<p><strong>Price:</strong> {item.price}</p>
							{/if}
							{#if seller && seller.storeTitle}
								<p><strong>Shop:</strong> {seller.storeTitle}</p>
							{/if}
							{#if delivery && delivery.shippingFrom}
								<p><strong>Shipping From:</strong> {delivery.shippingFrom}</p>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<p>No se encontraron resultados.</p>
		{/if}
	</div>
{/if}

<style>
	.results {
		margin-top: 20px;
	}

	.item-list {
		list-style-type: none;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.item {
		width: calc(50% - 10px); /* Dos columnas */
		margin-bottom: 20px;
		border: 1px solid #ddd;
		padding: 10px;
		display: flex;
	}

	.item img {
		width: 100px;
		height: auto;
		margin-right: 10px;
	}

	.item-details {
		flex-grow: 1;
	}
</style>
