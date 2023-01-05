<script>
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
	import { descending,max } from 'd3-array';
	import { format } from 'd3-format';
	import {wrapText} from './wrapText.js'
	import IntersectionObserver from "svelte-intersection-observer";

    let d3 = { scaleLinear, scaleOrdinal, descending, format, max} // 

export let data;
export let id;
export let color;

console.log('data in list',data)

function latestNumber(items){
  // console.log('in latest Number',items)
  // sorting values
    items.values.sort((a,b) => d3.descending(a.key, b.key))
    let value = items.values.find( d => d.value  !="")
	console.log('latestNumber', value)
    return value;
}

function capFirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
function createLabel(text){
	return wrapText(capFirst(text), labelWidth)
}
</script>
<div id="ind_{id.replaceAll('.','-')}"  class="list">
	{#each data as listData,i}
		<div class="row listRow border-bottom {(i===0)?'border-top':''}">
			<div class="col-7 listDescription">
				{listData.description}
			</div>
			<div class="col-5">
				<span class="listNumber" style="color:{color}">{latestNumber(listData).value}{(listData.unite != '%')?" ":""}{listData.unite}</span> ({latestNumber(listData).key})
			</div>
		</div>
	{/each}
</div>
