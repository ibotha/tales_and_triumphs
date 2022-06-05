import { FunctionComponent, useEffect, useState } from "react";
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  convertFromRaw,
  convertToRaw,
  Editor,
  EditorState,
  Modifier,
  SelectionState,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./documentEditor.scss";
import FolderTree, { eObjectTypes } from "../noteExplorer/FolderTree";
import ModalComponent from "../structure/ModalComponent";
import DocumentLink from "./DocumentLink";
import EditorControls from "./EditorControls";
import FolderLink from "./FolderLink";
import AutoSuggestionDecorator from "./AutoSuggestDecorator";
import _ from "lodash";
import {
  getCurrentlySelectedAutosuggest,
  InsertLinkEntity,
  setDecoratedTextGenerator,
} from "./editorUtil";
import { handleBeforeInput, handleReturn } from "./editorHandlers";
import {
  findNamedEntitiesFactory,
  findRegexEntitiesFactory,
} from "./editorDecorators";
import { AutosuggestMap } from "./editorTypes";
import AutoSuggest from "./AutoSuggest";

type Props = {
  startContent: string;
  worldId: string;
  editable: boolean;
  save: (content: string) => void;
};

const findDocumentLinkEntities = findNamedEntitiesFactory("DOCUMENT LINK");
const findFolderLinkEntities = findNamedEntitiesFactory("FOLDER LINK");

const findAutoComplete = findRegexEntitiesFactory(/(@\`[^@\`]*\`)/g);

const DocumentEditor: FunctionComponent<Props> = ({
  save,
  editable,
  startContent,
  worldId,
}) => {
  let setDecoratedText = (text: string, entityKey: string) => {};
  const [suggestRanges, setSuggestRanges] = useState<AutosuggestMap>({});
  const [isFocused, setIsFocused] = useState(false);
  const decorator = new CompositeDecorator([
    {
      strategy: findDocumentLinkEntities,
      component: DocumentLink,
      props: {
        setDecoratedText: (text: string, entityKey: string) => {
          setDecoratedText(text, entityKey);
        },
      },
    },
    {
      strategy: findFolderLinkEntities,
      component: FolderLink,
      props: {
        setDecoratedText: (text: string, entityKey: string) => {
          setDecoratedText(text, entityKey);
        },
      },
    },
    {
      strategy: (
        contentBlock: ContentBlock,
        callback: (start: number, end: number) => void,
        contentState: ContentState
      ) => {
        let ranges: { start: number; end: number }[] = [];
        findAutoComplete(
          contentBlock,
          (start, end) => {
            ranges.push({ start, end });
            callback(start, end);
          },
          contentState
        );
        const key = contentBlock.getKey();
        if (!_.isEqual(suggestRanges[key], ranges))
          setSuggestRanges((suggestRanges) => {
            suggestRanges[key] = ranges;
            return suggestRanges;
          });
      },
      component: AutoSuggestionDecorator,
      props: {
        setDecoratedText: (text: string, entityKey: string) => {
          setDecoratedText(text, entityKey);
        },
      },
    },
  ]);

  const [editorState, setEditorStateInternal] = useState(
    startContent.length > 0
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(startContent)),
          decorator
        )
      : EditorState.createEmpty(decorator)
  );

  const setEditorState = (state: EditorState) => {
    setEditorStateInternal(() => state);
  };

  useEffect(() => {
    const saveInterval = () =>
      save(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
    const interval = setInterval(saveInterval, 10000);
    return clearInterval(interval);
  });

  setDecoratedText = setDecoratedTextGenerator(setEditorStateInternal);
  const [editorRef, setEditorRef] = useState<Editor | null>();
  const [findFolderModal, setFindFolderModal] = useState(false);
  const setEditorStateKeepSelection = (editorState: EditorState) => {
    setEditorState(
      EditorState.forceSelection(editorState, editorState.getSelection())
    );
  };
  const [currentAutoSuggest, id, match] = isFocused
    ? getCurrentlySelectedAutosuggest(editorState, suggestRanges) ?? [
        undefined,
        undefined,
        undefined,
      ]
    : [undefined, undefined, undefined];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "min-content auto",
        gap: "0.5em",
      }}
    >
      {editable ? (
        <EditorControls
          editorState={editorState}
          setEditorState={setEditorStateKeepSelection}
          onSave={() =>
            save(JSON.stringify(convertToRaw(editorState.getCurrentContent())))
          }
          onLink={() => setFindFolderModal(true)}
        />
      ) : null}

      <div className="editor-container" onClick={() => editorRef?.focus()}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          ref={(ref) => {
            setEditorRef(ref);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={!editable}
          handleBeforeInput={handleBeforeInput(setEditorState)}
          handleReturn={
            currentAutoSuggest ? () => "handled" : handleReturn(setEditorState)
          }
        />
      </div>
      {findFolderModal ? (
        <ModalComponent close={() => setFindFolderModal(false)}>
          <FolderTree
            worldId={worldId}
            onSelect={(s) => {
              setEditorState(
                EditorState.push(
                  editorState,
                  InsertLinkEntity(
                    editorState.getCurrentContent(),
                    editorState.getSelection(),
                    s
                  ),
                  "apply-entity"
                )
              );
              setFindFolderModal(false);
            }}
            showDocuments={true}
          ></FolderTree>
        </ModalComponent>
      ) : null}
      {currentAutoSuggest ? (
        <AutoSuggest
          followId={id}
          worldId={worldId}
          value={currentAutoSuggest}
          onSelect={(s) => {
            const contentState = editorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity(
              s.type === eObjectTypes.Document
                ? "DOCUMENT LINK"
                : "FOLDER LINK",
              "IMMUTABLE",
              {
                id: s.id,
              }
            );
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

            const newContentState = Modifier.applyEntity(
              contentStateWithEntity,
              SelectionState.createEmpty(match.key).merge({
                anchorOffset: match.start,
                focusOffset: match.end,
              }),
              entityKey
            );
            setEditorState(
              EditorState.push(editorState, newContentState, "apply-entity")
            );
          }}
        ></AutoSuggest>
      ) : null}
    </div>
  );
};

export default DocumentEditor;
