import { ContentState, EditorState, Modifier, SelectionState } from "draft-js";
import { OrderedSet } from "immutable";
import { eObjectTypes, ObjectBundle } from "../noteExplorer/FolderTree";
import { AutosuggestMap } from "./editorTypes";

export const InsertLinkEntity = (
  contentState: ContentState,
  selectionState: SelectionState,
  s: ObjectBundle
) => {
  const contentStateWithEntity = contentState.createEntity(
    s.type === eObjectTypes.Document ? "DOCUMENT LINK" : "FOLDER LINK",
    "IMMUTABLE",
    {
      id: s.id,
    }
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  const contentStateWithLink = Modifier.insertText(
    contentStateWithEntity,
    selectionState,
    `{${s.type}:${s.id}}`,
    OrderedSet(["INSERT"]),
    entityKey
  );
  return contentStateWithLink;
};

export const setDecoratedTextGenerator =
  (setEditorState: (state: (state: EditorState) => EditorState) => void) =>
  async (text: string, entityKey: string) => {
    setEditorState((editorState) => {
      setTimeout(async () => {
        const res = await new Promise<{
          start: number;
          end: number;
          blockKey: string;
        }>((resolve, reject) => {
          const contentState = editorState.getCurrentContent();
          contentState.getBlocksAsArray().forEach((block) => {
            block.findEntityRanges(
              (v) => {
                return v.getEntity() === entityKey;
              },
              (start, end) => {
                resolve({ start, end, blockKey: block.getKey() });
              }
            );
          });
        });

        const selectionState = SelectionState.createEmpty(res.blockKey).merge({
          anchorOffset: res.start,
          focusOffset: res.end,
        });
        let newState = Modifier.replaceText(
          editorState.getCurrentContent(),
          selectionState,
          text,
          undefined,
          entityKey
        );
        setEditorState(() =>
          EditorState.push(editorState, newState, "insert-fragment")
        );
      }, 1);
      return editorState;
    });
  };

const findText = (
  state: ContentState,
  key: string,
  start: number,
  end: number
) => {
  return state.getBlockForKey(key).getText().slice(start, end);
};

export const getCurrentlySelectedAutosuggest = (
  editorState: EditorState,
  suggestionMap: AutosuggestMap
):
  | [string, string, { key: string; start: number; end: number }]
  | undefined => {
  const selection = editorState.getSelection();
  const currentBlockKey = selection.getAnchorKey();
  if (currentBlockKey != selection.getFocusKey()) return undefined;
  const start = selection.getStartOffset();
  const end = selection.getEndOffset();
  if (currentBlockKey in suggestionMap)
    for (let i = 0; i < suggestionMap[currentBlockKey].length; i++) {
      const range = suggestionMap[currentBlockKey][i];
      if (start > range.start && end < range.end) {
        const suggestion = findText(
          editorState.getCurrentContent(),
          currentBlockKey,
          range.start,
          range.end
        );
        return [
          suggestion.slice(2, suggestion.length - 1),
          `${currentBlockKey}-${range.start}`,
          { key: currentBlockKey, ...range },
        ];
      }
    }
};
