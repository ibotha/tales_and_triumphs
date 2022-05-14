import { FunctionComponent, useState } from "react";
import { useRootFolderQuery } from "../../generated/graphql-components";
import FolderTreeFolder from "./FolderTreeFolder";
import "./noteExplorer.scss";

export enum eObjectTypes {
  Document = "document",
  Folder = "folder",
}

export interface ObjectBundle {
  id: string;
  type: eObjectTypes;
}

type Props = {
  onSelect: (selection: ObjectBundle) => void;
  worldId: string;
  showDocuments: boolean;
  before?: React.ReactNode;
  after?: React.ReactNode;
};

const FolderTree: FunctionComponent<Props> = ({
  onSelect,
  worldId,
  showDocuments,
  before,
  after,
}) => {
  const [{ fetching, data, error }] = useRootFolderQuery({
    variables: { worldId: worldId },
  });

  const [selection, setSelection] = useState<ObjectBundle | null>(null);

  if (fetching) return <div>Loading...</div>;
  if (!data || !data.world || !data.world.rootFolder || error)
    return <div>{JSON.stringify(error)}</div>;
  return (
    <div className="folder-tree-container">
      <div>{before}</div>
      <div className="folder-tree">
        <FolderTreeFolder
          onSelect={(newSelection: ObjectBundle) => {
            if (!selection || selection.id != newSelection.id)
              setSelection(newSelection);
          }}
          folderId={data.world.rootFolder.id}
          selection={selection}
          showSelf={false}
          showDocuments={showDocuments}
        ></FolderTreeFolder>
      </div>
      <div>
        <div
          v-if="selectedId"
          className="btn"
          onClick={() => {
            if (selection) onSelect(selection);
          }}
          style={{ marginBottom: "0.5em" }}
        >
          Select
        </div>
        {after}
      </div>
    </div>
  );
};

export default FolderTree;
