<script>
	import LinesDouble from './LinesDouble.svelte';

export let data;
export let id;
export let color;

//-----
$: console.log('data in multiple lines double',data)

$: sets = [... new Set(data.filter(k => k.unit != 'subtitle').map( d => d.set))]
$: console.log('sets',sets)

function displaySubtitle(dataSet){
	let subtitle ="";
	dataSet.forEach((d,i) => subtitle += (i>0)?" | "+d.description: d.description)
	return subtitle
}

</script>
{#each sets as set}
<h5 class="subtitle">{displaySubtitle(data.filter( k => (k.set === set) ))}</h5>
	<LinesDouble
		data= {data.filter( k => (k.set === set) && (k.unit != 'subtitle'))}
		id = {id+'_'+set}
		color = {color}
	>
  	</LinesDouble>
{/each}
