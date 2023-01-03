<script>
    import {tweened} from 'svelte/motion';
    import IntersectionObserver from "svelte-intersection-observer";
	import { cubicOut } from 'svelte/easing';

    export let rectStyle;
    export let rectClass;
    export let xValue;
    export let yValue;
    export let heightValue;
    export let widthValue = 0;

    let element;

    const widthProgress = tweened(0, {
        duration: 1000,
        easing:cubicOut,
        delay:500
    })

</script>
<IntersectionObserver {element}
    on:intersect={ e => {if (e.detail.isIntersecting) widthProgress.set(widthValue)}}
    >
    <g bind:this = {element} >
        <rect
            x={xValue} 
            y={yValue}
            height={heightValue} 
            width={$widthProgress}
            class={rectClass}
            style={rectStyle} 
            >
        </rect>
    </g>

</IntersectionObserver>
