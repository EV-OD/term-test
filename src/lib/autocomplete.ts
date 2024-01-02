import type XtermController from "./xterm";

class AutoCompleteSession {
  helper: {};
  visible: boolean;
  elt: HTMLElement;
  charLength: number;
  lineHeight: number;
  xTerm: XtermController;
  lineHeightOffset: number;
  currentCommand: string;
  constructor(elt: HTMLElement, xTerm: XtermController) {
    this.helper = {};
    this.visible = false;
    this.elt = elt;
    this.xTerm = xTerm;
    this.hide();
    this.charLength = 10;
    this.lineHeight = 0;
    this.lineHeightOffset = 10;
    this.currentCommand = "";
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
  }
  hide() {
    this.visible = false;
    this.elt.style.visibility = "hidden";
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
