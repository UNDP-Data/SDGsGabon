<script>
    import { scaleLinear} from 'd3-scale';
	import { max } from 'd3-array';
	import {wrapText} from './wrapText.js';
//	import BarRect from './BarRect.svelte';

    let d3 = { scaleLinear, max} // 

export let data;
export let id;
export let color;
export let latestValue;

let maxValue = 0;
let compareItems, compareValue, compareDescription;
let yBar, unit;

const barHeight = 30;
let width = 400, height = 300;
const margin = {'top':30,'right':110,'bottom':30,'left':170}
const labelWidth = 24;
let dataFiltered;

$: yBar = 15;

function yPosition(i){
	// check in data if not first element, if set is different from previous add additional pixels
	if ((i > 0) && (sets.length > 0) && (dataFiltered[i].groupe != dataFiltered[i-1].groupe )) yBar += 60;
	else yBar += barHeight+5;
	return yBar;
}
$: dataFiltered = data.filter(d => (d.parametre != 'comparer') && d.valeurs[latestValue.key]!=undefined)

$: sets = [... new Set(dataFiltered.map( d => d.groupe))]

$: height = ((barHeight+5) * dataFiltered.length) + sets.length * 30 + margin.bottom + margin.top; 

$: {
	compareItems = data.filter(d => d.parametre == 'comparer')
	if (compareItems.length > 0) {
		compareValue = compareItems[0].valeurs[latestValue.key];
		compareDescription = compareItems[0].description;
		unit = compareItems[0].unite;
		unit = (unit!='%')?` ${unit}`:unit;
	}
	else {
		compareItems =[], compareValue='',compareDescription='';
	}
}

$: maxValue= d3.max(data, d=> Number(d.valeurs[latestValue.key]))

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
			{#each dataFiltered as barData,i}
				<!--- group containing bar rect and text -->
				<g transform="translate(0,{yPosition(i)})">
					<rect
						x = 0
						y = 0
						class="bar" 
						height="{barHeight}" 
						width={hScale(Number(barData.valeurs[latestValue.key]))} 
						style="fill: {color}"
					></rect>
					<!-- BarRect
						xValue = 0
						yValue = 0
						rectClass="bar" 
						heightValue="{barHeight}" 
						widthValue={hScale(Number(barData[latestValue.key].replace(',','.')))} 
						rectStyle="fill: {color}"
					></BarRect-->
					<g transform="translate(-5,16)">
						<text text-anchor="end" dominant-baseline="text-after-edge">{@html createLabel(barData.description)}</text>
					</g>
					<text class="barNumber" 
						x="{hScale(Number(barData.valeurs[latestValue.key])) + 5}" 
						y={barHeight - 1} 
						style="opacity: 1;"
					>			
					{barData.valeurs[latestValue.key]}{(barData.unite!='%')?' '+barData.unite: barData.unite}
					</text>

				</g>
			{/each}
			<!-- compare line -->
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
					y="20"
					text-anchor="end"
					>{compareDescription}
				</text>
				<text class="comparetext" 
					x="{hScale(Number(compareValue))+7}" 
					y="20">{compareValue}{unit}
				</text>
			{:else}
				-
			{/if}
		</g>
		<text y="50">An: {latestValue.key}</text>
	</svg>
</div>
