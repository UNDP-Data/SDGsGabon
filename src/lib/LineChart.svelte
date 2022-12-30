<script>
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
	import { ascending,max, extent } from 'd3-array';
	import { format } from 'd3-format';
	import { select, selectAll} from 'd3-selection'; 
	import { axisBottom, axisLeft } from 'd3-axis';
	import { line } from 'd3-shape';

	import Tooltip from './Tooltip.svelte'  
	import BarRect from './BarRect.svelte';
	import { onMount } from 'svelte';

    let d3 = { scaleLinear, scaleOrdinal, ascending, format, max, extent,select,axisBottom,axisLeft,line} // 

export let data;
export let id;
export let color;
export let unit;

//console.log('data',data)
//-----
data.sort((a,b) => d3.ascending(a.key, b.key))
const margin = {"top": 20, "right":80, "left":60}
const chartWidth = 400, chartHeight = 250;

$: domain = d3.extent(data, d => {if (d.value !="") return Number(d.key)})
$: maxValue = d3.max(data, d => {if (d.value !="") return Number(d.value)})
//console.log('maxValue',maxValue)
//console.log('domain',domain)
$: x = d3.scaleLinear()
	.range([0, chartWidth-margin.right])
	.domain(domain)

$: y= d3.scaleLinear()
	.rangeRound([chartHeight - margin.top, 0])
	.domain([0,maxValue*1.5]);

$: xAxis = (g, x) => g
	.call(d3.axisBottom(x)
		.tickSize(6)
		//.tickSizeOuter(5)
		.tickPadding(7)
		.tickValues(data.map(d => {if (d.value != undefined) return Number(d.key)}))
		.tickFormat(d=> d.toFixed(0))
	)
	.call(g => g.select(".domain").remove());

const path = d3.line()
            .x(function(d) { return x(d.key) })
            .y(function(d) { return y(d.value) })

//console.log('tickvalues',data.map(d => {if (d.value != undefined) return Number(d.key)})) 
$: yAxis = (g, y) => g
	.call(d3.axisLeft(y)
			.tickSizeOuter(0)
			.tickPadding(30)
			.tickSize(- chartWidth + margin.right)
			.ticks(3)
		)
	.call(g => g.select(".domain").remove());

onMount(async () => {
	let svg = d3.select(`#ind_${id.replaceAll('.','-')}`)
	//console.log('svg',`#ind${id.replaceAll('.','-')}`)
	svg.select('.xAxis').call(xAxis,x)

	// Add Y axis
	svg.select('.yAxis').call(yAxis,y);

//mounted =true;
})

</script>
<div id="ind_{id.replaceAll('.','-')}" class="lineChart">
	<svg viewBox="0 0 440 300">
		<g transform="translate(60,20)">
			<g transform="translate(0, 230)" class="xAxis" fill="none" font-size="10" text-anchor="middle"></g>
			<g class="yAxis" fill="none" font-size="10" text-anchor="end"></g>
			<path fill="none" stroke="{color}" stroke-width="1.5" d={path(data.filter(d=> d.value != ""))}></path>
			{#each data.filter(d=> d.value != "") as dot}
			<g transform="translate({x(Number(dot.key))},{y(Number(dot.value))})">
				<circle r="5" fill="{color}"></circle>
				<text y="-10" text-anchor="middle" style="opacity: 1;">{dot.value}{unit}</text>
			</g>
			{/each}
		</g>
	</svg>
</div>
