<script>
    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import {page} from '$app/stores';

    let API="/api/v1/life-expectancy";
    if(dev){
        API="http://localhost:10000/api/v1/life-expectancy";
    }

    let country=$page.params.Country;
    let year=$page.params.Year;
    let selectedLifeExpectancy=[];

    onMount(()=>{
        getSelectedLifeExpectancy();
    })

    async function getSelectedLifeExpectancy(){
        let response=await fetch(API,{
                            method:"GET"
                        })

        let data=await response.json();
        data.forEach((le) => {
            if(le.country==country && le.year==year){
                selectedLifeExpectancy.push(le);
            }
        });
    }
</script>

{#if selectedLifeExpectancy.length > 0}
    <p>Country: {selectedLifeExpectancy[0].country}</p>
    <p>Year: {selectedLifeExpectancy[0].year}</p>
{/if}