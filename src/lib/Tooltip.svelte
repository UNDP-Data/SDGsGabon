<script>
    import { select } from 'd3-selection'; 
    let d3 = { select }

	export let content = '';
	export let div;
    export let displayTooltip;
    export let svg;

    //console.log('in tooltip',div)

    if (displayTooltip == undefined) displayTooltip =true;
	
	function mouseMove(event) {
        d3.select('.'+div).html(content).style('display','block')
        let divWidth = d3.select('.'+div).node().getBoundingClientRect().width;
        let divHeight = d3.select('.'+div).node().getBoundingClientRect().height;
        d3.select('.'+div)
            .style("top", (event.pageY - divHeight - 15) + "px")
		    .style("left", (event.pageX - divWidth/2)  + "px")
	}
	function mouseLeave() {
        d3.select('.'+div).style('display','none')
	}
</script>
{#if displayTooltip}
{#if svg}
    <g on:mouseleave={mouseLeave} on:mousemove={mouseMove} >
        <slot />
    </g>
{:else}
    <span on:mouseleave={mouseLeave} on:mousemove={mouseMove} >
        <slot />
    </span>
{/if}
{:else}
    <slot />
{/if}
