<script>
    import { scaleLinear} from 'd3-scale';
	import { max, min, extent } from 'd3-array';
	import { select } from 'd3-selection'; 
	import { axisBottom, axisLeft } from 'd3-axis';
	import { line } from 'd3-shape';
	import { onMount } from 'svelte';
	import Tooltip from './Tooltip.svelte';
    let d3 = { scaleLinear, max, min, extent, select, axisBottom, axisLeft,line} // 

export let data;
export let id;

const lineColors = {"Garçons":"#FBC412","Filles":"#D12800","Urbain":"#00C1FF","Rural":"#59BA47"}
const otherColors = ["#FBC412","#00C1FF","#EE402D"]
let mounted = false;

const margin = {"top": 20, "right":40, "bottom":60, "left":70}
let width, height = 270;
let offset = 15;
let gx,gy;
let maxValue;
let maxLineValue, minLineValue;

$: maxValue=0;

$: data.forEach((lineData) => {
		// max
		maxLineValue = d3.max(lineData.values, d => Number(d.value))
		maxValue = (maxLineValue > maxValue)?maxLineValue:maxValue;
		// min
		minLineValue = d3.min(lineData.values, d => Number(d.value))
		minValue = (minLineValue < minValue)?minLineValue:minValue;

	})
// assuming for the domain that the years with data
// are the same for both lines
$: domain = d3.extent(data[0].values, d =>  Number(d.key))

$: minValue = (minValue < 0)?minValue:0;

$: x = d3.scaleLinear()
	.range([offset, width -  margin.right - margin.left - offset])
	.domain(domain)

$: y= d3.scaleLinear()
	.domain([minValue*1.2,maxValue*1.2]).nice()
	.rangeRound([height - margin.bottom, margin.top])

$: xAxis = (g, x) => g
	.call(d3.axisBottom(x)
		.tickSize(6)
		.tickPadding(7)
		.tickValues(data[0].values.map(d => d.key))
		.tickFormat(d=> d.toFixed(0))
	)
	.call(g => g.select(".domain").remove());

$: path = d3.line()
		.x(d => x(d.key))
		.y(d => y(d.value))
 
$: yAxis = (g, y) => g
	.call(d3.axisLeft(y)
			.tickSizeOuter(0)
			.tickPadding(30)
			.tickSize(- width + margin.right + margin.left)
			.tickFormat(d => d + data[0].unite)
			.ticks(5)
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
			<g transform="translate(0, {height-margin.bottom})" class="xAxis" fill="none" font-size="10" text-anchor="middle">
			</g>
			<g class="yAxis" fill="none" font-size="10" text-anchor="end"></g>
			{#each data as lineData,j}
				<path fill="none" stroke="{findColor(lineData.description,j)}" opacity=".7" stroke-width="1.5" d={path(lineData.values)}></path>
				{#each lineData.values as dot, i}
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
