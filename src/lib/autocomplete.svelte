<script lang="ts">
    import { onMount } from "svelte";
    import AutoCompleteSession from "./autocomplete";
    import type XtermController from "./xterm";
  
    let elt: HTMLDivElement;
    let showList = true;
    let autocompleteList = ["lol", "fuck"];
    let selected: string | null = null;
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
        });
      }
    }
  
    // Handle keydown event
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        // Prevent default to avoid scrolling the page
        event.preventDefault();
  
        // Move selection based on arrow key
        const currentIndex = autocompleteList.indexOf(selected);
        let newIndex;
  
        if (event.key === "ArrowDown") {
          newIndex =
            currentIndex < autocompleteList.length - 1 ? currentIndex + 1 : 0;
        } else {
          newIndex = currentIndex > 0 ? currentIndex - 1 : autocompleteList.length - 1;
        }
  
        selected = autocompleteList[newIndex];
      } else if (event.key === "Enter" && selected !== null) {
        // Run the function on Enter key press
        runFunction(selected);
      }
    }
  
    // Run the function on click
    function handleClick(item: string) {
      runFunction(item);
    }
  
    // Run the function and close the autocomplete list
    function runFunction(item: string) {
      console.log("Selected item:", item);
      autocompleteList = [];
      // Add your logic to run the function based on the selected item
    }
  </script>
<svelte:document on:keydown={handleKeyDown} />
  
  <div class="absolute left-0 top-0 h-10 min-w-[200px] w-max" bind:this={elt}>
    <ul class="bg-black border rounded-md shadow-md ml-2">
      {#each autocompleteList as item}
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class="flex items-center gap-3 p-2 px-5 hover:bg-gray-800 hover:text-white bg-black transition-colors duration-100 cursor-pointer"
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
        <span class="text-white">{item}</span>
      </li>
      {/each}
    </ul>
  </div>
  