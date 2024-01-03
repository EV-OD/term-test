import { writable, type Writable } from "svelte/store";
import type XtermController from "./xterm";
import { commands } from "./commands";
import { autoComplete } from "./utils";
type ItemType = {
  name: string;
  id: string;
  isNameAndCommandSame: boolean;
  type: string;
  spaceCount: number;
  depth: number;
};

class AutoCompleteSession {
  helper: {};
  visible: boolean;
  elt: HTMLElement;
  charLength: number;
  lineHeight: number;
  xTerm: XtermController;
  lineHeightOffset: number;
  currentCommand: string;
  autoCompleteList: Writable<ItemType[]>;
  constructor(elt: HTMLElement, xTerm: XtermController) {
    this.helper = commands;
    this.visible = false;
    this.elt = elt;
    this.xTerm = xTerm;
    this.hide();
    this.charLength = 10;
    this.lineHeight = 0;
    this.lineHeightOffset = 10;
    this.currentCommand = "";
    this.autoCompleteList = writable([]);
  }
  getLineHeight() {
    this.lineHeight =
      this.xTerm.term.rows === 0
        ? 0
        : this.xTerm.term.element.clientHeight / this.xTerm.term.rows;
    return this.lineHeight;
  }
  setString(value: string) {
    this.currentCommand = value;
    return this.updateAutoCompleteList();
  }
  hide() {
    this.visible = false;
    this.elt.style.visibility = "hidden";
  }
  updateAutoCompleteList() {
    let a = autoComplete(this.currentCommand, this.helper);

    if (a.length == 0) {
      return false;
    }
    this.autoCompleteList.set(a);
    return true;
  }
  show(obj?: { x: number; y: number }) {
    if (obj) {
      this.elt.style.left = obj.x * this.charLength + "px";
      this.elt.style.top =
        obj.y * this.getLineHeight() + this.getLineHeight() + "px";
    }
    this.visible = true;
    this.elt.style.visibility = "visible";
  }
}

export default AutoCompleteSession;
