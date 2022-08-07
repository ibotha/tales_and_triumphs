import { FunctionComponent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./worldView.scss";
import Permissions from "../../components/noteExplorer/Permissions";
import FolderTree, {
  ObjectBundle,
} from "../../components/noteExplorer/FolderTree";
import ConfirmComponent from "../../components/structure/ConfirmComponent";
import ModalComponent from "../../components/structure/ModalComponent";
import TitleComponent from "../../components/structure/TitleComponent";
import {
  useDeleteDocumentMutation,
  useDocumentQuery,
  useMoveDocumentMutation,
} from "../../generated/graphql-components";
import CreateSection from "../../components/documentEditor/CreateSection";
import Section from "../../components/documentEditor/Section";
import ContentEditable from "react-contenteditable";
import RenameDocument from "./RenameDocument";

type Props = {};

const DocumentView: FunctionComponent<Props> = ({}) => {
  const params = useParams();
  const navigate = useNavigate();

  let [deleteDocumentModal, setDeleteDocumentModal] = useState(false);

  const [{ fetching, data, error }] = useDocumentQuery({
    variables: {
      id: params.documentId!,
    },
  });

  const [_, deleteDocumentMutation] = useDeleteDocumentMutation();

  let deleteDocument = () => {
    deleteDocumentMutation({ id: params.documentId! }).then((e) => {
      if (e.data?.deleteDocument && data?.document?.parentFolder) {
        navigate(`../folder/${data.document.parentFolder.id}`);
        setDeleteDocumentModal(false);
      }
    });
  };

  const [moveDocumentModal, setMoveDocumentModal] = useState(false);
  const [renameDocumentModal, setRenameDocumentModal] = useState(false);
  const [newSectionModal, setNewSectionModal] = useState(false);

  const [, moveMutation] = useMoveDocumentMutation();

  const moveDocument = (select: ObjectBundle) => {
    if (select.type === "document") return;
    moveMutation({
      documentId: params.documentId!,
      parentFolderId: select.id,
    });
    setMoveDocumentModal(false);
  };

  if (fetching) return <div>Loading...</div>;
  if (!data || !data.document || error)
    return <div>{JSON.stringify(error)}</div>;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "min-content auto min-content",
        height: "100%",
        gap: "0.5em",
      }}
    >
      <div onClick={() => setRenameDocumentModal(true)}>
        <TitleComponent
          style={{ background: "var(--color-background-soft)" }}
          text={data.document.name}
        />
      </div>
      <div className="document-sections-container">
        <div style={{ display: "flex", gap: "0.5em" }}>
          <Link
            className="btn"
            to={`../folder/${data?.document?.parentFolder?.id}`}
          >
            <i className="fa fa-caret-left" aria-hidden="true"></i>
          </Link>
          {data.document.objectAccessControl.editable ? (
            <div className="btn" onClick={() => setMoveDocumentModal(true)}>
              Move
            </div>
          ) : null}
          {data.document.objectAccessControl.editable ? (
            <div
              style={{ backgroundColor: "brown" }}
              className="btn"
              onClick={() => setDeleteDocumentModal(true)}
            >
              Delete
            </div>
          ) : null}
        </div>
        {data.document.sections.map((s) => {
          return <Section sectionId={s.id} key={s.id}></Section>;
        })}
        <div className="btn" onClick={() => setNewSectionModal(true)}>
          +
        </div>
      </div>
      <Permissions
        objectAccessControlId={data.document.objectAccessControl.id as string}
        worldId={params.worldId as string}
      />
      {deleteDocumentModal ? (
        <ModalComponent close={() => setDeleteDocumentModal(false)}>
          <ConfirmComponent
            no={() => setDeleteDocumentModal(false)}
            yes={deleteDocument}
          >
            <h2
              style={{
                maxWidth: "30ch",
                textAlign: "center",
                marginBottom: "1em",
              }}
            >
              Are you sure you want to delete this document?
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
      {newSectionModal ? (
        <ModalComponent close={() => setNewSectionModal(false)}>
          <CreateSection
            documentId={params.documentId!}
            onSuccess={() => setNewSectionModal(false)}
          />
        </ModalComponent>
      ) : null}
      {renameDocumentModal ? (
        <ModalComponent close={() => setRenameDocumentModal(false)}>
          <RenameDocument
            uid={params.documentId!}
            onSuccess={() => setRenameDocumentModal(false)}
            initialValue={data.document.name}
          />
        </ModalComponent>
      ) : null}
    </div>
  );
};

export default DocumentView;
