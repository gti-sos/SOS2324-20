<script>
    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import {page} from '$app/stores';

    let API="/api/v1/food";
    if(dev){
        API="http://localhost:10000/api/v1/food";
    }

    let entity=$page.params.Entity;
    let year=$page.params.Year;
    let selectedFood=[];

    onMount(()=>{
        getSelectedFood();
    })

    async function getSelectedFood(){
        let response=await fetch(API,{
                            method:"GET"
                        })

        let data=await response.json();
        data.forEach((f) => {
            if(f.Entity==entity && f.Year==year){
                selectedFood.push(f);
            }
        });
    }
</script>

{#if selectedFood.length > 0}
    <p>Entity: {selectedFood[0].Entity}</p>
    <p>Year: {selectedFood[0].Year}</p>
{/if}