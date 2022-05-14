import {
  DraftHandleValue,
  EditorState,
  Modifier,
  RichUtils,
  SelectionState,
} from "draft-js";
import { OrderedSet } from "immutable";

export const blockToAbrvTypeMap = {
  "header-one": "H1",
  "header-two": "H2",
  "header-three": "H3",
};

const newBlockAfterReturn = new Set([...Object.keys(blockToAbrvTypeMap)]);

export const handleReturn =
  (
    setEditorState: (state: EditorState) => void
  ): Draft.DraftComponent.Base.DraftEditorProps["handleReturn"] =>
  (e, editorState) => {
    if (newBlockAfterReturn.has(RichUtils.getCurrentBlockType(editorState))) {
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
      setEditorState(
        EditorState.forceSelection(
          EditorState.createWithContent(content),
          selection
        )
      );
      return "handled";
    }
    return "not-handled";
  };

export const handleBeforeInput =
  (setEditorState: (state: EditorState) => void) =>
  (
    chars: string,
    editorState: EditorState,
    eventTimeStamp: number
  ): DraftHandleValue => {
    if (chars == "`") {
      const key = editorState.getSelection().getAnchorKey();
      const anchorOffset = editorState.getSelection().getAnchorOffset();
      const content = editorState.getCurrentContent();
      const char = content.getBlockForKey(key).getText()[anchorOffset - 1];
      const newSelection = editorState
        .getSelection()
        .set("anchorOffset", anchorOffset + 1)
        .set("focusOffset", anchorOffset + 1) as SelectionState;
      if (char == "@") {
        setEditorState(
          EditorState.forceSelection(
            EditorState.push(
              editorState,
              Modifier.insertText(
                content,
                editorState.getSelection(),
                "``",
                OrderedSet(["INSERT"])
              ),
              "insert-characters"
            ),
            newSelection
          )
        );
        return "handled";
      }
    }
    return "not-handled";
  };
