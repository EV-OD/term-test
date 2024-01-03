import { Terminal } from "xterm";
import type AutoCompleteSession from "./autocomplete";

interface CommandType {
  name: string;
  id: string;
  isNameAndCommandSame: boolean;
  type: string;
}

class XtermController {
  term: Terminal;
  command: string;
  autoCompleteSession: AutoCompleteSession;
  commandObj: CommandType[];
  spaceCount: number;

  constructor(term: Terminal, autoComplete: AutoCompleteSession) {
    this.term = term;
    this.command = "";
    this.commandObj = [];
    this.spaceCount = 0;
    this.autoCompleteSession = autoComplete;
    this.init();
  }

  init() {
    this.prompt();
    this.term.onData((e) => this.handleKeyPress(e));
  }

  handleKeyPress(key: string) {
    switch (key) {
      case "\u0003": // Ctrl+C
        this.term.write("^C");
        this.prompt();
        break;
      case "\r": // Enter
        if (!this.autoCompleteSession.visible) {
          this.runCommand();
          this.command = "";
        }
        this.autoCompleteSession.hide();
        break;
      case "\u007F": // Backspace (DEL)
        this.handleBackspace();
        break;
      default:
        this.handleDefaultKey(key);
    }
  }

  handleBackspace() {
    if (this.spaceCount > 0) {
      this.spaceCount--;
    }
    if (this.term.buffer.active.cursorX > 2) {
      this.term.write("\b \b");
      if (this.command.length > 0) {
        this.command = this.command.slice(0, -1);
      }
      this.updateAutoComplete();
    }
  }

  handleDefaultKey(key: string) {
    if (
      (key >= String.fromCharCode(0x20) && key <= String.fromCharCode(0x7e)) ||
      key >= "\u00a0"
    ) {
      this.command += key;
      this.term.write(key);
      this.updateAutoComplete();
    }
    if (key === " ") {
      this.spaceCount++;
    }
  }

  updateAutoComplete() {
    let command = this.command;
    if (command.length === 0) {
      return this.autoCompleteSession.hide();
    }
    if (this.autoCompleteSession.setString(command)) {
      this.autoCompleteSession.show(this.getCursorPosition());
    } else {
      this.autoCompleteSession.hide();
    }
  }

  appendCommandObj(obj: CommandType) {
    this.commandObj.push(obj);
  }

  clearCommandObj() {
    this.commandObj = [];
  }

  updateCommand(c: string) {
    this.clearInput(this.command);
    this.command = c;
    this.term.write(c);
  }

  writeCommand(obj: CommandType) {
    this.appendCommandObj(obj);
    this.command = obj.name;
  }

  clearInput(command: string) {
    const inputLength = command.length;
    for (let i = 0; i < inputLength; i++) {
      this.term.write("\b \b");
    }
  }

  prompt() {
    this.command = "";
    this.term.write("\r\n$ ");
  }

  runCommand() {
    if (this.command.length > 0) {
      this.term.writeln(""); // Move to the next line for better visibility
      this.term.writeln(`Executing command: ${this.command}`);
      // Add logic to handle the actual command execution here
      // For example, you can use tauri.promisified to communicate with your Tauri backend
      // tauri.promisified('execute_command', { command: this.command });
    }
    this.prompt(); // Add a new prompt line after command execution
  }

  getCursorPosition(): { x: number; y: number } {
    const cursorX = this.term.buffer.active.cursorX;
    const cursorY =
      this.term.buffer.active.baseY + this.term.buffer.active.cursorY;
    return { x: cursorX, y: cursorY };
  }
}

export default XtermController;
