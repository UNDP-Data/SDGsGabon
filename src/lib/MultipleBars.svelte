<script>
	import Bars from './Bars.svelte'

export let data;
export let id;
export let color;
export let latestValue;
export let subtitles;

$: console.log('id',id)
$: console.log('barchart group data ---- ',data)
$: console.log('latestValue',latestValue)

$: sets = [... new Set(data.map( d => d.groupe))]
$: console.log('sets',sets)


// add title
// separate the data in sets

</script>
{#each sets as set}
	{#if subtitles[set]}
		<h5 class="subtitle">{subtitles[set]}</h5>
	{/if}
	<Bars 
		data={data.filter( k => (k.groupe === set))}
		id = {id+'_'+set}
		color = {color}
		latestValue={latestValue}
	></Bars>
{/each}

