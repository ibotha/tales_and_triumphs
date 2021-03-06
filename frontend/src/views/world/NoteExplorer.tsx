import { FunctionComponent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreateDocument from "../../components/noteExplorer/CreateDocument";
import CreateFolder from "../../components/noteExplorer/CreateFolder";
import DocumentIcon from "../../components/noteExplorer/DocumentIcon";
import FolderIcon from "../../components/noteExplorer/FolderIcon";
import FolderPermissions from "../../components/noteExplorer/Permissions";
import FolderTree, {
  ObjectBundle,
  eObjectTypes,
} from "../../components/noteExplorer/FolderTree";
import UpdateFolder from "../../components/noteExplorer/UpdateFolder";
import ConfirmComponent from "../../components/structure/ConfirmComponent";
import ModalComponent from "../../components/structure/ModalComponent";
import {
  useDeleteFolderMutation,
  useFolderQuery,
  useMoveFolderMutation,
} from "../../generated/graphql-components";
import "./worldView.scss";
import RenameFolder from "./RenameFolder";

type Props = {};

const NoteExplorer: FunctionComponent<Props> = ({}) => {
  const params = useParams();
  const navigate = useNavigate();

  const [createFolderModal, setCreateFolderModal] = useState(false);
  const [createDocumentModal, setCreateDocumentModal] = useState(false);
  const [jumpToModal, setJumpToModal] = useState(false);
  const [deleteFolderModal, setDeleteFolderModal] = useState(false);
  const [updateFolder, setUpdateFolder] = useState<{
    id: string;
    name: string;
    colour: string;
  } | null>(null);

  const [{ fetching, data, error }, executeQuery] = useFolderQuery({
    variables: {
      id: params.folderId!,
    },
  });
  const [_, deleteFolderMutation] = useDeleteFolderMutation();

  const [moveDocumentModal, setMoveDocumentModal] = useState(false);
  const [renameFolderModal, setRenameFolderModal] = useState(false);

  const [, moveMutation] = useMoveFolderMutation();

  const moveDocument = (select: ObjectBundle) => {
    if (select.type === "document") return;
    moveMutation({
      folderId: params.documentId!,
      parentFolderId: select.id,
    });
    setMoveDocumentModal(false);
  };

  if (fetching) return <div>Loading...</div>;
  if (!data || !data.folder || error) return <div>{JSON.stringify(error)}</div>;

  let deleteFolder = () => {
    deleteFolderMutation({ id: params.folderId! }).then((e) => {
      if (e.data?.deleteFolder) {
        navigate(`../folder/${data.folder!.parentFolder?.id}`);
        setDeleteFolderModal(false);
      }
    });
  };

  let updateClicked = (i: number) => {
    setUpdateFolder(data.folder!.subfolders[i]);
  };

  const jumpTo = (s: ObjectBundle) => {
    if (s.type === eObjectTypes.Document) navigate(`../document/${s.id}`);
    else if (s.type === eObjectTypes.Folder) navigate(`../folder/${s.id}`);
    setJumpToModal(false);
  };
  return (
    <div style={{ height: "100%" }}>
      <h2
        style={{ backgroundColor: "var(--color-background-mute)", margin: "0" }}
      >
        Notes
      </h2>
      <div
        style={{
          display: "grid",
          gap: "0.25em",
          gridTemplateRows: "min-content min-content auto min-content",
          height: "100%",
        }}
      >
        {data.folder.parentFolder ? (
          <div onClick={() => setRenameFolderModal(true)}>
            <h2
              style={{
                backgroundColor: "var(--color-background-mute)",
                boxShadow: "2px 1px 5px rgb(0.3, 0.3, 0.3, 0.2)",
              }}
            >
              {data.folder.name}
            </h2>
          </div>
        ) : (
          <div></div>
        )}
        <div style={{ display: "flex", gap: "0.25em", padding: "0 0.5em" }}>
          {data.folder.parentFolder ? (
            <Link
              className="btn"
              to={`../folder/${data.folder.parentFolder!.id}`}
            >
              <i className="fa fa-caret-left" aria-hidden="true"></i>
            </Link>
          ) : null}

          <div onClick={() => setCreateFolderModal(true)} className="btn">
            <i className="fa fa-folder" aria-hidden="true"></i>+
          </div>
          <div onClick={() => setCreateDocumentModal(true)} className="btn">
            <i className="fa fa-file" aria-hidden="true"></i>+
          </div>
          <div onClick={() => setJumpToModal(true)} className="btn">
            <i className="fa fa-align-left" aria-hidden="true"></i>
          </div>
          {data.folder.parentFolder &&
          data.folder.objectAccessControl.editable ? (
            <div className="btn" onClick={() => setMoveDocumentModal(true)}>
              Move
            </div>
          ) : null}
          {data.folder.parentFolder &&
          data.folder.objectAccessControl.editable ? (
            <div
              style={{ backgroundColor: "brown" }}
              className="btn"
              onClick={() => setDeleteFolderModal(true)}
            >
              Delete
            </div>
          ) : null}
        </div>
        <div className="explorer">
          {data.folder.subfolders.map((folder, i) => {
            return (
              <FolderIcon
                key={folder.id}
                folderId={folder.id}
                onUpdateClicked={() => updateClicked(i)}
              />
            );
          })}

          {data.folder.documents.map((folder, i) => {
            return <DocumentIcon key={folder.id} documentId={folder.id} />;
          })}
        </div>
        {data.folder.parentFolder &&
        data.folder.objectAccessControl.editable ? (
          <FolderPermissions
            objectAccessControlId={data.folder.objectAccessControl.id}
            worldId={params.worldId!}
          ></FolderPermissions>
        ) : (
          <div></div>
        )}
      </div>
      {createFolderModal ? (
        <ModalComponent
          close={() => {
            setCreateFolderModal(false);
          }}
        >
          <CreateFolder
            onSuccess={() => setCreateFolderModal(false)}
            worldId={params.worldId!}
            parentFolderId={params.folderId!}
          />
        </ModalComponent>
      ) : null}
      {createDocumentModal ? (
        <ModalComponent
          close={() => {
            setCreateDocumentModal(false);
          }}
        >
          <CreateDocument
            onSuccess={() => setCreateDocumentModal(false)}
            worldId={params.worldId!}
            parentFolderId={params.folderId!}
          />
        </ModalComponent>
      ) : null}
      {jumpToModal ? (
        <ModalComponent close={() => setJumpToModal(false)}>
          <FolderTree
            worldId={params.worldId!}
            showDocuments={true}
            onSelect={jumpTo}
            before={<h2>Jump To</h2>}
            after={
              <div className="btn" onClick={() => setJumpToModal(false)}>
                Cancel
              </div>
            }
          ></FolderTree>
        </ModalComponent>
      ) : null}
      {updateFolder ? (
        <ModalComponent close={() => setUpdateFolder(null)}>
          <UpdateFolder
            folder={updateFolder}
            onSuccess={() => setUpdateFolder(null)}
          ></UpdateFolder>
        </ModalComponent>
      ) : null}
      {deleteFolderModal ? (
        <ModalComponent close={() => setDeleteFolderModal(false)}>
          <ConfirmComponent
            no={() => setDeleteFolderModal(false)}
            yes={deleteFolder}
          >
            <h2
              style={{
                maxWidth: "30ch",
                textAlign: "center",
                marginBottom: "1em",
              }}
            >
              Are you sure you want to delete your folder?
            </h2>
          </ConfirmComponent>
        </ModalComponent>
      ) : null}
      {moveDocumentModal ? (
        <ModalComponent close={() => setMoveDocumentModal(false)}>
          <h2>Move</h2>
          <FolderTree
            worldId={params.worldId!}
            showDocuments={false}
            onSelect={moveDocument}
          ></FolderTree>
          <div className="btn" onClick={() => setMoveDocumentModal(false)}>
            Cancel
          </div>
        </ModalComponent>
      ) : null}

      {renameFolderModal ? (
        <ModalComponent close={() => setRenameFolderModal(false)}>
          <RenameFolder
            uid={params.folderId!}
            onSuccess={() => setRenameFolderModal(false)}
            initialValue={data.folder.name}
          />
        </ModalComponent>
      ) : null}
    </div>
  );
};

export default NoteExplorer;
