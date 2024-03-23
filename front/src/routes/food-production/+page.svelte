<script>
	import { onMount } from 'svelte';

	let API = 'http://localhost:10000/api/v1/food-production';
	let foods = []; //por tener distinto puerta tiene que ser así estática

	onMount(() => {
		createFoodProduction();
	});

	async function createFoodProduction() {
		let newFood = {
			Entity: "Portugal",
			Year: 1971, // Cambia el año a uno que no exista en la base de datos
			rice_production: 366000,
			tomatoes_production: 3111482,
			tea_production: 121398,
			potatoes_production: 144000,
			cocoa_beans_production: 1120835,
			meat_chicken_production: 9600,
			bananas_production: 4076156
		};

		let response = await fetch(API, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newFood, null, 2)
		});
		let data = await response.status;
		console.log(`Creation response status ${data}`);
	}
</script>

<ul>
	{#each foods as food}
		<li>{food.Entity}</li>
	{/each}
</ul>
<button on:click={createFoodProduction}>Create</button>
