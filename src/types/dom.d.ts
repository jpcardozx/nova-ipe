// This augments the built-in HTMLElement interface
interface HTMLElement extends Element {
  scrollHeight: number;
}

interface HTMLHtmlElement extends HTMLElement {
  scrollHeight: number;
}
