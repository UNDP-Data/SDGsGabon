<script>
	import LinesDouble from './LinesDouble.svelte';

export let data;
export let id;
export let color;

//-----
console.log('data in multiple lines double',data)

$: sets = [... new Set(data.map( d => d.groupe))]
$: console.log('sets',sets)
console.log()

function displaySubtitle(dataSet){
	//add color keys
	let subtitle ="";
	dataSet.forEach((d,i) => subtitle += (i>0)?" | "+d.description: d.description)
	return subtitle
}

</script>
{#each sets as set}
<h5 class="subtitle">{displaySubtitle(data.filter( k => (k.groupe === set) ))}</h5>
	<LinesDouble
		data= {data.filter( k => (k.groupe === set) )}
		id = {id+'_'+set}
		color = {color}
	>
  	</LinesDouble>
{/each}
