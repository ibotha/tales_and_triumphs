import { EditorState, RichUtils } from "draft-js";
import { FunctionComponent } from "react";
import Dropdown from "../form/Dropdown";

type Props = {
  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
  onSave: () => void;
  onLink: () => void;
};

const blockToAbrvTypeMap = {
  "header-one": "H1",
  "header-two": "H2",
  "header-three": "H3",
};

const abrvToBlockTypeMap = {
  H1: "header-one",
  H2: "header-two",
  H3: "header-three",
};

const EditorControls: FunctionComponent<Props> = ({
  editorState,
  onLink,
  onSave,
  setEditorState,
}) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div
      className="editor-controls"
      style={{
        zIndex: 10,
        backgroundColor: "var(--color-background-soft)",
        padding: "0.25em",
        display: "flex",
        flexDirection: "row",
        gap: "0.25em",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ display: "flex" }}>
        <div
          style={{
            borderRight: `2px solid ${
              RichUtils.getCurrentBlockType(editorState) in blockToAbrvTypeMap
                ? "var(--color-secondary)"
                : "transparent"
            }`,
          }}
        ></div>

        <Dropdown
          options={["H1", "H2", "H3"]}
          value={
            blockToAbrvTypeMap[
              RichUtils.getCurrentBlockType(
                editorState
              ) as keyof typeof blockToAbrvTypeMap
            ] || "H1"
          }
          onChange={(v) => {
            setEditorState(
              RichUtils.toggleBlockType(
                editorState,
                abrvToBlockTypeMap[v as keyof typeof abrvToBlockTypeMap]
              )
            );
          }}
        >
          B
        </Dropdown>
      </div>
      <div
        className={
          "btn " +
          (RichUtils.getCurrentBlockType(editorState) === "unordered-list-item"
            ? ""
            : "inactive")
        }
        onClick={() => {
          setEditorState(
            RichUtils.toggleBlockType(editorState, "unordered-list-item")
          );
        }}
      >
        *
      </div>
      <div
        className={
          "btn " +
          (RichUtils.getCurrentBlockType(editorState) === "ordered-list-item"
            ? ""
            : "inactive")
        }
        onClick={() => {
          setEditorState(
            RichUtils.toggleBlockType(editorState, "ordered-list-item")
          );
        }}
      >
        1.
      </div>
      <div
        className={"btn " + (currentStyle.has("BOLD") ? "" : "inactive")}
        onClick={() => {
          setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
        }}
        style={{ fontWeight: "bold" }}
      >
        B
      </div>
      <div
        className={"btn " + (currentStyle.has("ITALIC") ? "" : "inactive")}
        onFocus={(e) => e.preventDefault()}
        onClick={(e) => {
          e.preventDefault();
          setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
        }}
        style={{ fontStyle: "italic" }}
      >
        I
      </div>
      <div className={"btn"} onClick={onLink}>
        Link
      </div>
      <div className={"btn"} onClick={onSave} style={{ fontStyle: "italic" }}>
        Save
      </div>
    </div>
  );
};

export default EditorControls;
