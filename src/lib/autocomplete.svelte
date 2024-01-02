<script lang="ts">
  import { onMount } from "svelte";
  import AutoCompleteSession from "./autocomplete";
  import type XtermController from "./xterm";

    let elt:HTMLDivElement;
    let showList = true;
    let autocompleteList = ["lol","fuck"];
    let selected:string|null = null;
    export let autoComplete:AutoCompleteSession;
    export let xTerm:XtermController;
    onMount(()=>{
        autoComplete = new AutoCompleteSession(elt,xTerm);
    })
    $:{
        if(xTerm){
            autoComplete.xTerm = xTerm
        }
    }

</script>

<div class="absolute left-0 top-0 h-10 min-w-[200px] w-max" bind:this={elt}>
    <ul class="bg-white border rounded-md shadow-md ml-2">
    {#each autocompleteList as item}
        <li class="p-2 px-5 hover:bg-blue-500 hover:text-white bg-white transition-colors duration-100">{item}</li>
    {/each}
    </ul>
</div>
