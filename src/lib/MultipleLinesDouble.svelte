<script>
	import LinesDouble from './LinesDouble.svelte';

export let data;
export let id;

$: sets = [... new Set(data.filter(d => d.parametre != "comparer").map(d =>  d.groupe))]
//$: console.log('sets',sets)
</script>
{#each sets as set}
	<LinesDouble
		data= {data.filter( k => (k.groupe === set || k.parametre === "comparer") )}
		id = {id+'_'+set}
	>
  	</LinesDouble>
{/each}
