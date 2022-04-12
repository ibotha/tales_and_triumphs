import { FunctionComponent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DocumentPermissions from "../../components/documentEditor/DocumentPermissions";
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
  useUpdateDocumentMutation,
} from "../../generated/graphql-components";

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

  const [, saveDocument] = useUpdateDocumentMutation();

  let save = (content: string) => {
    saveDocument({
      id: params.documentId!,
      content: content,
    });
  };

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
    <div>
      <div style={{ display: "flex", gap: "0.5em" }}>
        <Link
          className="btn"
          to={`../folder/${data?.document?.parentFolder?.id}`}
        >
          <i className="fa fa-caret-left" aria-hidden="true"></i>
        </Link>
        {data.document.editable ? (
          <div className="btn" onClick={() => setMoveDocumentModal(true)}>
            Move
          </div>
        ) : null}
        {data.document.editable ? (
          <div
            style={{ backgroundColor: "brown" }}
            className="btn"
            onClick={() => setDeleteDocumentModal(true)}
          >
            Delete
          </div>
        ) : null}
      </div>

      <TitleComponent text={data.document.name} />
      {/* <DocumentEditor
      :start-content="data?.document?.content"
      :editable="data?.document?.editable"
      @save="save"
    ></DocumentEditor> */}
      <DocumentPermissions
        documentId={params.documentId as string}
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
    </div>
  );
};

export default DocumentView;
