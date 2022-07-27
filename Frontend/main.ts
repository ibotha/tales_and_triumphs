import "./style.scss";
import { Elm } from "./src/Main.elm";
import EditorJS, { Tool } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Underline from "@editorjs/underline";
import Checklist from "@editorjs/checklist";
import List from "@editorjs/list";

if (process.env.NODE_ENV === "development") {
  const ElmDebugTransform = await import("elm-debug-transformer");

  ElmDebugTransform.register({
    simple_mode: true,
  });
}

customElements.define('tnt-editor',
    class extends HTMLElement {
        // things required by Custom Elements
        constructor() { super(); }
        connectedCallback() {
          this.onkeydown = (e) => {
            e.preventDefault();
          }
        }
        attributeChangedCallback() { this.setTextContent(); }
        static get observedAttributes() { return ['class']; }

        // Our function to set the textContent based on attributes.
        setTextContent()
        {
          
        }
    }
);

const root = document.querySelector("#app div");
const app = Elm.Main.init({ node: root });

console.log(app.ports);
