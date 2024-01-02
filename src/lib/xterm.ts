import { Terminal } from "xterm";
import type AutoCompleteSession from "./autocomplete";

class XtermController {
  term: Terminal;
  command: string;
  autoCompleteSession: AutoCompleteSession;

  constructor(term: Terminal, autoComplete: AutoCompleteSession) {
    this.term = term;
    this.command = "";
    this.autoCompleteSession = autoComplete;
    this.init();
  }

  init() {
    this.prompt(this.term);
    this.term.onData((e) => {
      switch (e) {
        case "\u0003": // Ctrl+C
          this.term.write("^C");
          this.prompt(this.term);
          break;
        case "\r": // Enter
          this.runCommand(this.term, this.command);
          this.command = "";
          // this.updateAutoComplete();
          this.autoCompleteSession.hide();
          break;
        case "\u007F": // Backspace (DEL)
          // Do not delete the prompt
          if (this.term.buffer.active.cursorX > 2) {
            this.term.write("\b \b");
            if (this.command.length > 0) {
              this.command = this.command.slice(0, -1);
            }
            this.updateAutoComplete();
          }
          break;
        case "\u0009":
          // console.log("tabbed", this.output, ["dd", "ls"]);
          break;
        default:
          if (
            (e >= String.fromCharCode(0x20) &&
              e <= String.fromCharCode(0x7e)) ||
            e >= "\u00a0"
          ) {
            this.command += e;
            this.term.write(e);
            this.autoCompleteSession.setString(this.command);
            this.updateAutoComplete();
          }
      }
    });
  }
  updateAutoComplete() {
    this.autoCompleteSession.show(this.getCursorPosition());
  }

  clearInput(command: string) {
    const inputLength = command.length;
    for (let i = 0; i < inputLength; i++) {
      this.term.write("\b \b");
    }
  }

  prompt(term: Terminal) {
    this.command = "";
    term.write("\r\n$ ");
  }

  onMessage(event: MessageEvent) {
    this.term.write(event.data);
  }

  runCommand(term: Terminal, command: string) {
    if (command.length > 0) {
      term.writeln(""); // Move to the next line for better visibility
      term.writeln(`Executing command: ${command}`);
      // Add logic to handle the actual command execution here
      // For example, you can use tauri.promisified to communicate with your Tauri backend
      // tauri.promisified('execute_command', { command });
    }
    this.prompt(term); // Add a new prompt line after command execution
  }
  getCursorPosition(): { x: number; y: number } {
    const cursorX = this.term.buffer.active.cursorX;
    const cursorY =
      this.term.buffer.active.baseY + this.term.buffer.active.cursorY;
    return { x: cursorX, y: cursorY };
  }
}

export default XtermController;
