<script>
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
	import { ascending, max, min, extent } from 'd3-array';
	import { format } from 'd3-format';
	import { select, selectAll} from 'd3-selection'; 
	import { axisBottom, axisLeft } from 'd3-axis';
	import { line } from 'd3-shape';
	import { onMount } from 'svelte';
	import IntersectionObserver from "svelte-intersection-observer";
  	import { fade } from "svelte/transition";

    let d3 = { scaleLinear, scaleOrdinal, ascending, format, max, min, extent,select,axisBottom,axisLeft,line} // 

export let data;
export let id;
export let color;
export let unit;
console.log('unit',unit)

//-----
console.log('data in line',data)

let mounted = false;
const margin = {"top": 20, "right":70, "bottom":40, "left":70}
let width, height = 270;
let gx,gy;
let dataFiltered;
let minValue, maxValue;

$: dataFiltered = data.sort( (a,b) => a.key - b.key ).filter(d=> d.value != ""); // using only years with values for the vis
$: console.log('dataFiltered',dataFiltered)

$: domain = d3.extent(dataFiltered, d => {if (d.value !="") return Number(d.key)})
$: maxValue = d3.max(dataFiltered, d => {if (d.value !="") return Number(d.value)})
$: {
	minValue = d3.min(dataFiltered, d => {if (d.value !="") return Number(d.value)})
	minValue = (minValue < 0)?minValue:0
}

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
		.tickValues(dataFiltered.map(d => {if (d.value != undefined) return Number(d.key)}))
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

</script>
<div id="ind_{id.replaceAll('.','-')}" class="lineChart" bind:clientWidth={width}>
	<svg height="{height}" width="{width}">
		<g transform="translate({margin.left},{margin.top})">
			<g transform="translate(0, {height-margin.top-margin.bottom})" class="xAxis" fill="none" font-size="10" text-anchor="middle">
			<!-- line class='zeroLine' 
				x1 = x(minValue)
				x2 = x()
				y1 = y()
				y2 = y() ></line -->
			</g>
			<g class="yAxis" fill="none" font-size="10" text-anchor="end"></g>
			<path fill="none" stroke="{color}" stroke-width="1.5" d={path(dataFiltered)}></path>
			{#each dataFiltered as dot}
			<g transform="translate({x(Number(dot.key))},{y(Number(dot.value))})">
				<circle r="5" fill="{color}"></circle>
				<text y="-10" text-anchor="middle" style="opacity: 1;">{dot.value}{unit}</text>
			</g>
			{/each}
		</g>
	</svg>
</div>
