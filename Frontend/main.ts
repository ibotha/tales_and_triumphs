import "./style.scss";
import { Elm } from "./src/Main.elm";
import "@webcomponents/webcomponentsjs/webcomponents-bundle.js";
import "@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js";
import "elm-rte-toolkit";

class DocRef extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
    console.log("hi");
    // Element functionality written in here
  }
  connectedCallback() {}
}

customElements.define("doc-ref", DocRef);

if (process.env.NODE_ENV === "development") {
  const ElmDebugTransform = await import("elm-debug-transformer");

  ElmDebugTransform.register({
    simple_mode: true,
  });
}

const root = document.querySelector("#app div");
const app = Elm.Main.init({ node: root });

console.log(app.ports);
