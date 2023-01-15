<script>
	import LineChart from './LineChart.svelte';

export let data;
export let id;
export let color;

//$: console.log('data',data)

</script>
{#each data as lineData,i}
<h5 class="subtitle">{lineData.description}</h5>
	<LineChart
		data= {lineData.values}
		id = {id+'_'+i}
		color = {color}
		unit = {lineData.unite}
	>
  	</LineChart>
{/each}

