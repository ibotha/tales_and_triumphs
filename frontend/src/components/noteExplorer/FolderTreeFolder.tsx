import { FunctionComponent, useState } from "react";
import { useFolderContentsQuery } from "../../generated/graphql-components";
import { ObjectBundle, ObjectTypes } from "./FolderTree";

type Props = {
  selection?: ObjectBundle | null;
  folderId: string;
  showSelf: boolean;
  showDocuments: boolean;
  onSelect: (selection: ObjectBundle) => void;
};

const FolderTreeFolder: FunctionComponent<Props> = ({
  selection,
  folderId,
  showSelf,
  showDocuments,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);

  const [{ fetching, error, data }] = useFolderContentsQuery({
    variables: { id: folderId },
  });

  if (fetching) return <div>Loading...</div>;
  if (!data || !data.folder || error) return <div>{JSON.stringify(error)}</div>;
  return (
    <div>
      <div
        onClick={() => onSelect({ id: folderId, type: ObjectTypes.Folder })}
        className={
          (selection &&
          selection.type === ObjectTypes.Folder &&
          selection.id === folderId
            ? "folder-tree-selected"
            : "") + " folder-tree-row"
        }
      >
        <i
          onClick={() => setOpen(!open)}
          className={open ? "fa fa-folder-open" : "fa fa-folder"}
          aria-hidden={true}
          style={{ color: data.folder.colour, marginRight: "0.25em" }}
        ></i>
        <span>{data.folder.name}</span>
      </div>
      {open ? (
        <div style={{ marginLeft: "1em" }}>
          {data.folder.subfolders.map((f) => {
            return (
              <div key={f.id}>
                <FolderTreeFolder
                  onSelect={onSelect}
                  folderId={f.id}
                  selection={selection}
                  showDocuments={showDocuments}
                  showSelf={true}
                ></FolderTreeFolder>
              </div>
            );
          })}
          {showDocuments ? (
            <div>
              {data.folder.documents.map((d) => {
                return (
                  <div
                    key={d.id}
                    className={
                      (selection &&
                      selection.type === ObjectTypes.Document &&
                      selection.id === d.id
                        ? "folder-tree-selected"
                        : "") + " folder-tree-row"
                    }
                    onClick={() =>
                      onSelect({ id: d.id, type: ObjectTypes.Document })
                    }
                  >
                    <i
                      className="fa fa-file"
                      aria-hidden="true"
                      style={{ marginRight: "0.25em" }}
                    ></i>
                    {d.name}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default FolderTreeFolder;
