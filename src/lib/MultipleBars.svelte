<script>
	import Bars from './Bars.svelte'

export let data;
export let id;
export let color;
export let unit;
export let latestValue;

$: console.log('id',id)
$: console.log('barchart group data ---- ',data)
$: sets = [... new Set(data.map( d => d.set))]
$: console.log('sets',sets)

// add title
// separate the data in sets

</script>
{#each sets as set}
	{#if data.filter( k => (k.set === set) && (k.unit == 'subtitle')).length >0}
		<h5 class="subtitle">{data.filter( k => (k.set === set) && (k.unit == 'subtitle'))[0].description}</h5>
	{/if}
	<Bars 
		data={data.filter( k => (k.set === set) && (k.unit != 'subtitle'))}
		id = {id+'_'+set}
		color = {color}
		unit ={unit}
		latestValue={latestValue}
	></Bars>
{/each}

