<script>
	import { createEventDispatcher } from 'svelte';
    import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'sveltestrap';

	export let value;
    export let options

    let isOpen = false;

	const dispatch = createEventDispatcher();

    function submit(){
        dispatch('submit', 
        {value: value});
    }

</script>

<Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>
    <DropdownToggle caret class='ifpgLabel text-uppercase'>{ value }</DropdownToggle>
    <DropdownMenu>
        {#each options as option}
            <DropdownItem on:click={()=> {value = option; submit()}}>{option}</DropdownItem>
        {/each}
    </DropdownMenu>
</Dropdown>
