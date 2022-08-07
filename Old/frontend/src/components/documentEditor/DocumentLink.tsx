import { ContentState } from "draft-js";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useDocumentQuery } from "../../generated/graphql-components";
import "./documentEditor.scss";

type Props = {
  contentState: ContentState;
  entityKey: string;
  setDecoratedText: (text: string, entityKey: string) => void;
  decoratedText: string;
};

const DocumentLink: FunctionComponent<Props> = (props) => {
  const entity = props.contentState.getEntity(props.entityKey);
  const { id } = entity.getData();
  const [{ fetching, data, error }] = useDocumentQuery({
    variables: { id },
  });

  if (fetching || !data || !data.document || error)
    return <span>{props.children}</span>;
  if (data.document.name !== props.decoratedText) {
    setTimeout(() => {
      if (data.document)
        props.setDecoratedText(data.document.name, props.entityKey);
    }, 1);
  }
  return (
    <Link
      to={`../document/${id}`}
      className="document-link"
      style={{ color: "var(--color-text-2)" }}
    >
      {props.children}
    </Link>
  );
};

export default DocumentLink;
