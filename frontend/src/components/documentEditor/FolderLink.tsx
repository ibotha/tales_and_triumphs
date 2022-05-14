import { ContentState } from "draft-js";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useFolderQuery } from "../../generated/graphql-components";
import "./documentEditor.scss";

type Props = {
  contentState: ContentState;
  entityKey: string;
  setDecoratedText: (text: string, entityKey: string) => void;
  decoratedText: string;
};

const FolderLink: FunctionComponent<Props> = (props) => {
  const entity = props.contentState.getEntity(props.entityKey);
  const { id } = entity.getData();
  const [{ fetching, data, error }] = useFolderQuery({
    variables: { id },
  });

  if (fetching || !data || !data.folder || error)
    return <span>{props.children}</span>;
  if (data.folder.name !== props.decoratedText) {
    setTimeout(() => {
      if (data.folder)
        props.setDecoratedText(data.folder.name, props.entityKey);
    }, 1);
  }
  return (
    <Link
      to={`../folder/${id}`}
      className="folder-link"
      style={{ color: "var(--color-text-2)" }}
    >
      {props.children}
    </Link>
  );
};

export default FolderLink;
