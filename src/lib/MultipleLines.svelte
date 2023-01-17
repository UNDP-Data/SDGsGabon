<script>
	import LineChart from './LineChart.svelte';

export let data;
export let id;
export let color;
export let subtitles;

$: sets = [... new Set(data.map( d => d.groupe))]

</script>
{#each sets as set}
	{#if subtitles[set]}
		<h5 class="subtitle">{subtitles[set]}</h5>
	{/if}
	{#each data.filter(d => d.groupe == set) as lineData,i}
		<h5 class="subtitle2">{lineData.description}</h5>
		<LineChart
			data= {lineData.values}
			id = {id+'_'+i}
			color = {color}
			unit = {lineData.unite}
		>
		</LineChart>
	{/each}
{/each}

