import { FunctionComponent, useEffect, useRef, useState } from "react";
import {
  ContentState,
  convertFromRaw,
  convertToRaw,
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  SelectionState,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./documentEditor.scss";
import Dropdown from "../form/Dropdown";
import { TypeOf } from "yup";
import FolderTree from "../noteExplorer/FolderTree";
import ModalComponent from "../structure/ModalComponent";

type Props = {
  startContent: string;
  worldId: string;
  editable: boolean;
  save: (content: string) => void;
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

const DocumentEditor: FunctionComponent<Props> = ({
  save,
  editable,
  startContent,
  worldId,
}) => {
  const [editorState, setEditorState] = useState(
    startContent.length > 0
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(startContent)))
      : EditorState.createEmpty()
  );
  const [editorRef, setEditorRef] = useState<Editor | null>();
  const [findFolderModal, setFindFolderModal] = useState(false);
  const currentStyle = editorState.getCurrentInlineStyle();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "min-content auto",
        gap: "0.5em",
      }}
    >
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
            (RichUtils.getCurrentBlockType(editorState) ===
            "unordered-list-item"
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
          onClick={() => {
            setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
          }}
          style={{ fontStyle: "italic" }}
        >
          I
        </div>
        <div className={"btn"} onClick={() => setFindFolderModal(true)}>
          Link
        </div>
        <div
          className={"btn"}
          onClick={() =>
            save(JSON.stringify(convertToRaw(editorState.getCurrentContent())))
          }
          style={{ fontStyle: "italic" }}
        >
          Save
        </div>
      </div>
      <div className="editor-container" onClick={() => editorRef?.focus()}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          ref={(ref) => {
            setEditorRef(ref);
          }}
          handleReturn={(a, editorState) => {
            if (
              RichUtils.getCurrentBlockType(editorState) in blockToAbrvTypeMap
            ) {
              // Create new content block
              let content = Modifier.splitBlock(
                editorState.getCurrentContent(),
                editorState.getSelection()
              );

              // Get the new content block's key
              let selection = editorState.getSelection();
              const newBlockKey = content
                .getBlockAfter(selection.getFocusKey())
                ?.getKey();
              if (!newBlockKey) return "not-handled";

              // Set the block type to paragraph
              selection = SelectionState.createEmpty(newBlockKey);
              content = Modifier.setBlockType(content, selection, "paragraph");
              setEditorState(() =>
                EditorState.forceSelection(
                  EditorState.createWithContent(content),
                  selection
                )
              );
              return "handled";
            }
            return "not-handled";
          }}
        />
      </div>
      {findFolderModal ? (
        <ModalComponent close={() => setFindFolderModal(false)}>
          <FolderTree
            worldId={worldId}
            onSelect={() => setFindFolderModal(false)}
            showDocuments={true}
          ></FolderTree>
        </ModalComponent>
      ) : null}
    </div>
  );
};

export default DocumentEditor;
