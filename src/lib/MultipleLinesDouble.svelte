<script>
	import LinesDouble from './LinesDouble.svelte';

export let data;
export let id;

//-----
//console.log('data in multiple lines double',data)

$: sets = [... new Set(data.map( d => d.groupe))]
//$: console.log('sets',sets)


</script>
{#each sets as set}
	<LinesDouble
		data= {data.filter( k => (k.groupe === set) )}
		id = {id+'_'+set}
	>
  	</LinesDouble>
{/each}
