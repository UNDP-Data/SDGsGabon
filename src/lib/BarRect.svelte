<script>
    import {tweened} from 'svelte/motion';

    export let rectClass;
    export let xValue;
    export let yValue;
    export let heightValue;
    export let widthValue =0;
    export let rxValue;

    const widthProgress = tweened(0)
    const heightProgress = tweened(0)

    $: widthProgress.set(widthValue)
    $: heightProgress.set(heightValue)

</script>

<rect 
    x={xValue} 
    y={yValue}
    height={$heightProgress} 
    width={$widthProgress}
    class="{rectClass}" 
    rx="{rxValue}" >
</rect>

