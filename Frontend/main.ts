import "./style.scss";
import { Elm } from "./src/Main.elm";
import EditorJS from "@editorjs/editorjs";

if (process.env.NODE_ENV === "development") {
  const ElmDebugTransform = await import("elm-debug-transformer");

  ElmDebugTransform.register({
    simple_mode: true,
  });
}

const root = document.querySelector("#app div");
const app = Elm.Main.init({ node: root });

var editor: EditorJS | null = null;

console.log(app.ports);
app.ports.upEditor.subscribe(function (up) {
  if (up) editor = new EditorJS("Editor");
  else if (editor) editor.destroy();
});
