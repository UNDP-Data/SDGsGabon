<script>
	import Bars from './Bars.svelte'

export let data;
export let id;
export let color;
export let latestValue;
export let subtitles;

$: sets = [... new Set(data.map( d => d.groupe))]

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

