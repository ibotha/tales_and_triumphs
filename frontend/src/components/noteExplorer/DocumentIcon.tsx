import "./noteExplorer.scss";
import { FunctionComponent } from "react";
import { useDocumentQuery } from "../../generated/graphql-components";
import { Link } from "react-router-dom";

type Props = { documentId: string };

const DocumentIcon: FunctionComponent<Props> = ({ documentId }) => {
  const [{ fetching, data, error }] = useDocumentQuery({
    variables: {
      id: documentId,
    },
  });
  if (fetching) return <div>Loading...</div>;
  if (!data || !data.document || error)
    return <div>{JSON.stringify(error)}</div>;

  return (
    <Link to={`../document/${documentId}`} className="document hover-bubble">
      {data.document.name}
      <hr style={{ marginBottom: "1em", marginTop: "1em" }} />
      <hr style={{ marginBottom: "1em" }} />
      <hr style={{ marginBottom: "1em" }} />
    </Link>
  );
};

export default DocumentIcon;
