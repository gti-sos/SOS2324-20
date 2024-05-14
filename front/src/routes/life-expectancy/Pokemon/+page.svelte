<script>
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';

    let data = [];
    let lista_pok = [];
    let message = 'Espera, se estan cargando los datos...';
    let result = '';

    let pokemonAPI = '/api/proxy/?url=https://pokeapi.co/api/v2/pokemon/';
    let API = '/api/v2/life-expectancy/?limit=1000000&offset=0';
    if (dev) {
        API = 'http://localhost:10000' + API;
        pokemonAPI = 'http://localhost:10000' + pokemonAPI;
    }

    function moduloNoCero(numero) {
    
    let modulo = numero % 1025;
    if (modulo === 0) {
        return 1025;
    }
    return modulo;
}

    async function all_fetch() {
        let response = await fetch(API);
        data = await response.json();
        let i = 1;
        for (let item of data) {
            let response = await fetch(pokemonAPI + moduloNoCero(i));
            i++;
            let pokemon = await response.json();
            pokemon = pokemon.forms[0].name;
            lista_pok.push([item.country,item.year,pokemon]);
        }
        // Actualiza lista_pok para que Svelte detecte los cambios
        lista_pok = [...lista_pok];
    }

    onMount(async () => {
        await all_fetch();
    });
</script>

<h4>Life Expectancy</h4>
{#if lista_pok.length == 0}
<p>{message}</p>
{/if}
<ul>
    {#each lista_pok as item}
        <li>El pókemon que representa a {item[0]} en el año {item[1]} es: {item[2]}</li>
    {/each}
</ul>
