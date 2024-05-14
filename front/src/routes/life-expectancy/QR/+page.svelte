<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

    let qrAPI= "https://api.qrserver.com/v1/create-qr-code/?data=https://sos2324-20-415018.ew.r.appspot.com/life-expectancy/";
	//Muestra si está en desarrollo
	let API = '/api/v2/life-expectancy';
	if (dev) {
		API = 'http://localhost:10000/api/v2/life-expectancy';
        qrAPI= "https://api.qrserver.com/v1/create-qr-code/?data=http://localhost:10000/life-expectancy/";
	}
    let url= "https://sos2324-20-415018.ew.r.appspot.com/";

    let data = [];
    async function getData() {
        const res = await fetch(API);
        data = await res.json();

        for (let i = 0; i < data.length; i++) {
            let pagina= data[i].country + '/' + data[i].year;
            data[i].qr = await fetch(qrAPI + pagina);
            data[i].qr = data[i].qr.url;
        }
        data= [...data];
    }

    onMount(async () => {
       await getData();
    });
</script>

{#each data as item}
    <div>
        <h2>Escanea este QR para acceder al recurso : {item.country} - {item.year}</h2>
        <img src={item.qr} alt="QR code">
    </div>
    
{/each}