<script>
	import LineChart from './LineChart.svelte';

export let data;
export let id;
export let color;
export let unit;

//$: console.log('id',id)
//$: console.log('linechart group data ---- ',data)
//$: console.log('sets ---',data.map( d => d.groupe))

$: sets = [... new Set(data.map( d => d.groupe))]
//console.log('sets',sets)

// add title
// separate the data in sets

</script>
{#each sets as set}
<h5 class="subtitle">{data.filter( k => (k.groupe === set) )[0].description}</h5>
	<LineChart
		data= {data.filter( k => (k.groupe === set))[0].values}
		id = {id+'_'+set}
		color = {color}
		unit = {unit}
	>
  	</LineChart>
{/each}

