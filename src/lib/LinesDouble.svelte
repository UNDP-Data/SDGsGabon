<script>
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
	import { ascending, max, min, extent } from 'd3-array';
	import { format } from 'd3-format';
	import { select } from 'd3-selection'; 
	import { axisBottom, axisLeft } from 'd3-axis';
	import { line } from 'd3-shape';
	import { onMount } from 'svelte';
	import Tooltip from './Tooltip.svelte';
	import {wrapText} from './wrapText.js';

	import IntersectionObserver from "svelte-intersection-observer";
  	import { fade } from "svelte/transition";

    let d3 = { scaleLinear, scaleOrdinal, ascending, format, max, min, extent,select,axisBottom,axisLeft,line} // 

export let data;
export let id;
export let color;

//-----
$: console.log('data in lines double',data)

let mounted = false;
const margin = {"top": 20, "right":100, "bottom":40, "left":70}
let width, height = 270;
let gx,gy;
let maxValue;
let maxLineValue, minLineValue;
let colors =  ['#fd9d24', '#3f7e44','#0a97d9'];
let labelWidth =10;

$: maxValue=0;

$: data.forEach((lineData) => {
		// using only years with values for the vis
		lineData.filteredValues = lineData.values.sort( (a,b) => a.key - b.key ).filter(d=> d.value != "")
		// max
		maxLineValue = d3.max(lineData.filteredValues, d => {if (d.value !="") return Number(d.value)})
		maxValue = (maxLineValue > maxValue)?maxLineValue:maxValue;
		// min
		minLineValue = d3.min(lineData.filteredValues, d => {if (d.value !="") return Number(d.value)})
		minValue = (minLineValue < minValue)?minLineValue:minValue;

	})
// assuming for the domain that the years with data
// are the same for both lines, domain based on 1st item
$: domain = d3.extent(data[0].filteredValues, d => {if (d.value !="") return Number(d.key)})

$: minValue = (minValue < 0)?minValue:0;

$: x = d3.scaleLinear()
	.range([0, width -  margin.right - margin.left])
	.domain(domain)

$: y= d3.scaleLinear()
	.rangeRound([height - margin.top - margin.bottom, 0])
	.domain([minValue*1.5,maxValue*1.5]);

$: xAxis = (g, x) => g
	.call(d3.axisBottom(x)
		.tickSize(6)
		.tickPadding(7)
		.tickValues(data[0].filteredValues.map(d => d.key))
		.tickFormat(d=> d.toFixed(0))
	)
	.call(g => g.select(".domain").remove());

$: path = d3.line()
            .x(function(d) { return x(d.key) })
            .y(function(d) { return y(d.value) })
 
$: yAxis = (g, y) => g
	.call(d3.axisLeft(y)
			.tickSizeOuter(0)
			.tickPadding(30)
			.tickSize(- width + margin.right + margin.left)
			.ticks(3)
		)
	.call(g => g.select(".domain").remove());

onMount(async () => {
	let svg = d3.select(`#ind_${id.replaceAll('.','-')}`)

	// Add X Y axis
	gx = svg.select('.xAxis').call(xAxis,x)
	gy = svg.select('.yAxis').call(yAxis,y);

	mounted= true;

})

$: if (mounted) gx.call(xAxis,x);
$: if (mounted) gy.call(yAxis,y);

function capFirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
function createLabel(text){
	return wrapText(capFirst(text), labelWidth)
}

</script>
<div id="ind_{id.replaceAll('.','-')}" class="lineChart" bind:clientWidth={width}>
	<svg height="{height}" width="{width}">
		<g transform="translate({margin.left},{margin.top})">
			<g transform="translate(0, {height-margin.top-margin.bottom})" class="xAxis" fill="none" font-size="10" text-anchor="middle">
			</g>
			<g class="yAxis" fill="none" font-size="10" text-anchor="end"></g>
			{#each data as lineData,j}
				<path fill="none" stroke="{colors[j]}" stroke-width="1.5" d={path(lineData.filteredValues)}></path>
				{#each lineData.filteredValues as dot, i}
				<g transform="translate({x(Number(dot.key))},{y(Number(dot.value))})">
					<Tooltip
						content = {lineData.description+": "+dot.value+data[j].unit}
						div = {'tooltipDiv'}
						displayTooltip= {true}
						svg={true}
                    >
					<circle r="5" fill="{colors[j]}"></circle>
					</Tooltip>
					{#if i === lineData.filteredValues.length-1}
					<g transform="translate(15,6)">


						<text style="opacity: 1;">{@html createLabel(data[j].description)}</text>
					</g>
					{/if}
				</g>
				{/each}
			{/each}
		</g>
	</svg>
</div>
