import { FunctionComponent, useEffect, useState } from "react";
import {
  useCreateDocumentMutation,
  useFolderAndDocumentSuggestionsQuery,
  useWorldQuery,
} from "../../generated/graphql-components";
import { eObjectTypes, ObjectBundle } from "../noteExplorer/FolderTree";

type Props = {
  followId: string;
  worldId: string;
  value: string;
  onSelect: (s: ObjectBundle) => void;
};

const AutoSuggest: FunctionComponent<Props> = ({
  followId,
  value,
  worldId,
  onSelect,
}) => {
  const [{ data: wData, fetching: wFetching, error: wError }] = useWorldQuery({
    variables: { id: worldId },
    requestPolicy: "network-only",
  });

  const [, createDocument] = useCreateDocumentMutation();

  const [{ data, fetching, error }] = useFolderAndDocumentSuggestionsQuery({
    variables: { nameFilter: value, worldId },
    requestPolicy: "network-only",
  });

  const suggestions =
    !fetching && data && !error
      ? data.documents
          .map((d) => ({
            type: eObjectTypes.Document,
            name: d.name,
            id: d.id,
          }))
          .concat(
            data.folders.map((f) => ({
              type: eObjectTypes.Folder,
              name: f.name,
              id: f.id,
            }))
          )
      : null;

  const [selectionNumber, setSelectionNumber] = useState(0);
  const listener = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.stopPropagation();
      e.preventDefault();
      if (suggestions)
        setSelectionNumber((selectionNumber + 1) % (suggestions.length + 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.stopPropagation();
      e.preventDefault();
      if (suggestions) {
        let desired = selectionNumber - 1;
        if (desired < 0) desired = suggestions.length;
        setSelectionNumber(desired);
      }
      return;
    }
    if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();
      if (suggestions && selectionNumber < suggestions.length) {
        onSelect(suggestions[selectionNumber]);
      } else {
        if (wData && wData.world && wData.world.rootFolder)
          createDocument({
            name: value,
            worldId,
            parentFolderId: wData.world.rootFolder.id,
          }).then((v) => {
            if (v.data?.createDocument?.data?.id) {
              const id = v.data?.createDocument?.data?.id;
              onSelect({
                type: eObjectTypes.Document,
                id: id,
              });
            }
          });
      }
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

  const rect = document.getElementById(followId)?.getBoundingClientRect();
  if (rect)
    return (
      <div
        style={{
          position: "fixed",
          top: rect.bottom,
          left: rect.left,
          zIndex: 100,
          background: "var(--color-background)",
          minWidth: "5em",
          padding: "0 0.25em",
          boxShadow: "0px 2px 2px rgb(0 0 0 / 20%)",
          border: "1px solid var(--color-secondary)",
        }}
      >
        {suggestions ? (
          <>
            {suggestions.map((d, i) => {
              return (
                <div
                  key={i}
                  style={{ color: i == selectionNumber ? "blue" : undefined }}
                >
                  {d.name}
                </div>
              );
            })}
            <div
              style={{
                color:
                  selectionNumber == suggestions.length ? "blue" : undefined,
              }}
            >
              {value} (New)
            </div>
          </>
        ) : (
          <div>fetching...</div>
        )}
      </div>
    );
  return <></>;
};

export default AutoSuggest;
