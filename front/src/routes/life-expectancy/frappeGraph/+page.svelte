<script>
	import { onMount } from 'svelte';
	import FrappeChart from 'svelte-frappe-charts';
    import { dev } from '$app/environment';

	//Muestra si está en desarrollo
	let API = '/api/v2/life-expectancy';
	if (dev) {
		API = 'http://localhost:10000/api/v2/life-expectancy';
	}


    async function obtenerDatos(){

        const response = await fetch(API+'?limit=100000000&offset=0');
        const data = await response.json();

        let labels = data.array.map(element => element.continent);
    }
</script>
