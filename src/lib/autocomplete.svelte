<script lang="ts">
    import { onMount } from "svelte";
    import AutoCompleteSession from "./autocomplete";
    import type XtermController from "./xterm";
  import { splitStringIntoArrayWithSpaces } from "./utils";
    type ItemType = { name: string; id: string; isNameAndCommandSame: boolean; type: string, spaceCount:number, depth:number }
    let elt: HTMLDivElement;
    let showList = true;
    let autocompleteList: ItemType[] = [];
    let selected: ItemType | null = null;
    export let autoComplete: AutoCompleteSession;
    export let xTerm: XtermController;
  
    onMount(() => {
      autoComplete = new AutoCompleteSession(elt, xTerm);
    });
  
    $: {
      if (xTerm) {
        autoComplete.xTerm = xTerm;
        autoComplete.autoCompleteList.subscribe((v) => {
          autocompleteList = v;
          selected = autocompleteList[0]
        });
      }
    }
  
    // Handle keyup event
    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
  
        // Move selection based on arrow key
        const currentIndex = autocompleteList.indexOf(selected);
        let newIndex;
  
        if (event.key === "ArrowDown") {
          newIndex =
            currentIndex < autocompleteList.length - 1 ? currentIndex + 1 : 0;
        } else {
          newIndex =
            currentIndex > 0 ? currentIndex - 1 : autocompleteList.length - 1;
        }
        
        selected = autocompleteList[newIndex];
        
      } else if (event.key === "Enter" && selected !== null) {
        // Run the function on Enter key press
        runFunction(selected);
      }
    }
  
    function handleClick(item:ItemType) {
      runFunction(item);
    }
  
  function runFunction(item:ItemType ) {
    const currentCommand = xTerm.command || '';
    let parts = currentCommand.trim().split(/\s+/);
    let spaceparts = splitStringIntoArrayWithSpaces(currentCommand)
    spaceparts = spaceparts.filter(s=> s.length > 0)


    if (parts.length > 0) {
      let lastItem = spaceparts[spaceparts.length - 1]
      if(lastItem === " "){
        parts.push(item.name)
      }else{
        parts[parts.length - 1] = item.name
      }
      parts = parts.filter(s=> s != " ")
      const newCommand = parts.join(" ");

      xTerm.updateCommand(newCommand);
    } else {
      xTerm.updateCommand(item.name);
    }

    autocompleteList = [];
  }
  </script>
  
  <svelte:document on:keyup={handleKeyUp} />
  
  <div class="absolute left-0 top-0 h-10 min-w-[200px] w-max" bind:this={elt}>
    <ul class=" ml-2 bg-slate-800 rounded-md overflow-hidden text-white shadow-md">
      {#each autocompleteList as item}
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class="flex items-center gap-3 p-2 px-5 text-sm bg-neutral-700 hover:bg-indigo-800 cursor-pointer"
        class:selected={selected === item}
        on:click={() => handleClick(item)}
      >
        <svg
          class="autocomplete-logo w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span class="text-white">{item.name}</span>
      </li>
      {/each}
    </ul>
  </div>

  <style>
    .selected {
        @apply bg-indigo-800;
    }
  </style>
  