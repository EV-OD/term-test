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
            cursorBlink: true,
            fontSize: 16,
            fontFamily: '"Menlo for Powerline", Menlo, Consolas, "Liberation Mono", Courier, monospace',
            theme: {
                foreground: '#d2d2d2',
                background: '#2b2b2b',
                cursor: '#adadad',
                black: '#000000',
                red: '#d81e00',
                green: '#5ea702',
                yellow: '#cfae00',
                blue: '#427ab3',
                magenta: '#89658e',
                cyan: '#00a7aa',
                white: '#dbded8',
                brightBlack: '#686a66',
                brightRed: '#f54235',
            }
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
    <div class="w-full h-96" bind:this={termContainer}></div>
    <Autocomplete bind:autoComplete {xTerm} />
  </main>
  
  <style>

  </style>