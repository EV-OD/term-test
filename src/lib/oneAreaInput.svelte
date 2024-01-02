<script lang="ts">
    import { onMount } from 'svelte';
    import 'xterm/css/xterm.css';  // Import xterm.css
    import { Terminal } from 'xterm';
    import { FitAddon } from 'xterm-addon-fit';
    import XtermController from './xterm';
    import Autocomplete from './autocomplete.svelte';
  import type AutoCompleteSession from './autocomplete';

    
  
    let xTerm:XtermController;
    let fitAddon;
    let termContainer : HTMLElement;
    let autoComplete:AutoCompleteSession;

    onMount(()=>{
        let term = new Terminal({
            cursorBlink: true
        });
        fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(termContainer);
        fitAddon.fit()
        xTerm = new XtermController(term, autoComplete)
        // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    })
  
  
  </script>
  
  <main>
    <div class="w-full h-56" bind:this={termContainer}></div>
    <Autocomplete bind:autoComplete {xTerm} />
  </main>
  
  <style>
  </style>