import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useDocumentQuery } from "../../generated/graphql-components";

type Props = {
  documentId: string;
};

const DocumentLink: FunctionComponent<Props> = ({ documentId }) => {
  const [{ fetching, data, error }] = useDocumentQuery({
    variables: { id: documentId },
  });

  if (fetching) return <div>Loading...</div>;
  if (!data || !data.document || error)
    return <div>{JSON.stringify(error)}</div>;

  return (
    <Link to={`/world/${data.document.world.id}/document/${documentId}`}>
      <strong>
        <i
          className="fa fa-file"
          area-hidden="true"
          style={{ marginRight: "3px" }}
        ></i>
        {data.document.name}
      </strong>
    </Link>
  );
};

export default DocumentLink;
