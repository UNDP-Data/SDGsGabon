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
export let unit;
export let latestValue;

unit = (unit!='%')?` ${unit}`:unit;

let maxValue = 0;
let compareItems, compareValue, compareDescription;
let yBar;
const barHeight = 30;
let width, height;
const margin = {'top':20,'right':110,'bottom':30,'left':170}
const labelWidth = 24;//margin.left - 60;

$: console.log('id',id)
$: console.log('barchart data ---- ',data)
$: yBar = 15;
//console.log('latestValue',latestValue)

function yPosition(i){
	// check in data if not first element, if set is different from previous add additional pixels
	if ((i > 0) && (sets.length > 0) && (dataFiltered[i].set != dataFiltered[i-1].set )) yBar += 60;
	else yBar += barHeight+5;
	//console.log('yBar',yBar, i)
	return yBar;
}
$: dataFiltered = data.filter(d => d.indicatorSetting != 'compare')
$: sets = [... new Set(dataFiltered.map( d => d.set))]
$: console.log('sets',sets)
$: height = ((barHeight+5) * data.filter( d => (d.indicatorSetting != 'compare')).length) + sets.length * 30 + 80; 

$: {
	compareItems = data.filter(d => d.indicatorSetting == 'compare')
	if (compareItems.length > 0) {
		compareValue = compareItems[0][latestValue.key].replace(',','.')
		compareDescription = compareItems[0].description;
	}
	else {
		compareItems =[], compareValue='',compareDescription='';
	}
}

$: {
	maxValue = 0;
	data.forEach(d => { 
		// to do : check if the same for all items
		let newMax = d3.max(d.values, k => Number(k.value))
		maxValue = (maxValue > newMax)? maxValue:newMax;       
	})
}

$: hScale = d3.scaleLinear()
        .range([0, width-margin.left-margin.right])
        .domain([0,maxValue])

		function capFirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
function createLabel(text){
	return wrapText(capFirst(text), labelWidth)
}
</script>
<div id="ind_{id.replaceAll('.','-')}" class="barChart" bind:clientWidth={width}>
	<svg height="{height}" width="{width}">
		<g transform = 'translate({margin.left},{margin.top})' class="bars">
				{#each data.filter( d => (d.indicatorSetting != 'compare')) as barData,i}
				<!--- group containing bar rect and text -->
				<g transform="translate(0,{yPosition(i)})">
					<rect class="bar" 
						height="{barHeight}" 
						width={hScale(Number(barData[latestValue.key].replace(',','.')))} 
						style="fill: {color}"
					></rect>
					<g transform="translate(-5,16)">
						<text text-anchor="end" dominant-baseline="text-after-edge">{@html createLabel(barData.description)}</text>
					</g>
					<text class="barNumber" 
						x="{hScale(Number(barData[latestValue.key].replace(',','.'))) + 5}" 
						y={barHeight - 1} 
						style="opacity: 1;"
					>			
					{barData[latestValue.key]}{barData.unit}
					</text>

				</g>
				{/each}
			{#if compareValue}
				<line class="compareline" 
					stroke-dasharray="2,2" 
					x1="{hScale(Number(compareValue))}" 
					x2="{hScale(Number(compareValue))}" 
					y1="0" 
					y2="{yBar + barHeight+10}">
				</line>
				<text class="comparetext" 
					x="{hScale(Number(compareValue))-7}" 
					y="20" style="font-size: 1.3em;"
					text-anchor="end"
					>{compareDescription}
				</text>
				<text class="comparetext" 
					x="{hScale(Number(compareValue))+7}" 
					y="20" style="font-size: 1.3em;">{compareValue}{unit}
				</text>
			{:else}
				-
			{/if}
			
		</g>
		<text y="40">An: {latestValue.key}</text>
	</svg>
</div>
