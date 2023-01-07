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

//-----
//console.log('data in lines double',data)
const lineColors = {"Garçons":"#FBC412","Filles":"#D12800","Urbain":"#00C1FF","Rural":"#59BA47"}
const otherColors = ["#FBC412","#00C1FF","#EE402D"]
let mounted = false;
const margin = {"top": 20, "right":100, "bottom":40, "left":70}
let width, height = 270;
let gx,gy;
let maxValue;
let maxLineValue, minLineValue;
//console.log('data lines',data)
$: maxValue=0;

$: data.forEach((lineData) => {
		// using only years with values for the vis
		lineData.sortedValues = lineData.values.sort( (a,b) => a.key - b.key )
		// max
		maxLineValue = d3.max(lineData.sortedValues, d => Number(d.value))
		maxValue = (maxLineValue > maxValue)?maxLineValue:maxValue;
		// min
		minLineValue = d3.min(lineData.sortedValues, d => Number(d.value))
		minValue = (minLineValue < minValue)?minLineValue:minValue;

	})
// assuming for the domain that the years with data
// are the same for both lines
$: domain = d3.extent(data[0].sortedValues, d =>  Number(d.key))

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
		.tickValues(data[0].sortedValues.map(d => d.key))
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
			.tickFormat(d => d + data[0].unite)
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

function findColor(description,i){
	if (description in lineColors) return lineColors[description]
	else return otherColors[i];
}
function displaySubtitle(dataSet){
	//add color keys
	let subtitle ="";
	dataSet.forEach((d,i) => subtitle += (i > 0)?` | <span style='border-bottom:3px solid ${findColor(d.description,i)}'>${d.description}</span>`: `<span style='border-bottom:3px solid ${findColor(d.description,i)}'>${d.description}</span>`)
	return subtitle
}

</script>
<div id="ind_{id.replaceAll('.','-')}" class="lineChart" bind:clientWidth={width}>
	<h5 class="subtitle">{@html displaySubtitle(data)}</h5>
	<svg height="{height}" width="{width}">
		<g transform="translate({margin.left},{margin.top})">
			<g transform="translate(0, {height-margin.top-margin.bottom})" class="xAxis" fill="none" font-size="10" text-anchor="middle">
			</g>
			<g class="yAxis" fill="none" font-size="10" text-anchor="end"></g>
			{#each data as lineData,j}
				<path fill="none" stroke="{findColor(lineData.description,j)}" opacity=".7" stroke-width="1.5" d={path(lineData.sortedValues)}></path>
				{#each lineData.sortedValues as dot, i}
				<g transform="translate({x(Number(dot.key))},{y(Number(dot.value))})">
					<Tooltip
						content = {lineData.description+": "+dot.value+data[j].unite}
						div = {'tooltipDiv'}
						displayTooltip= {true}
						svg={true}
                    >
					<circle r="5" opacity=".7" fill="{findColor(lineData.description,j)}"></circle>
					</Tooltip>
				</g>
				{/each}
			{/each}
		</g>
	</svg>
</div>
