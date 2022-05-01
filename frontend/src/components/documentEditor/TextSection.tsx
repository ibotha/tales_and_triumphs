import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import {
  useTextSectionQuery,
  useUpdateTextSectionMutation,
} from "../../generated/graphql-components";
import DocumentEditor from "./DocumentEditor";
import "./documentEditor.scss";

type Props = {
  uid: string;
};

const TextSection: FunctionComponent<Props> = ({ uid }) => {
  const params = useParams();
  const [{ fetching, data, error }] = useTextSectionQuery({
    variables: {
      id: uid,
    },
  });

  const [, save] = useUpdateTextSectionMutation();

  if (fetching) return <div>Loading...</div>;
  if (!data || !data.textSection || error)
    return <div>{JSON.stringify(error)}</div>;
  return (
    <div className="text-section-container">
      <DocumentEditor
        editable={true}
        save={(content) => {
          save({ id: uid, content });
        }}
        startContent={data.textSection.content}
        worldId={params.worldId!}
      ></DocumentEditor>
    </div>
  );
};

export default TextSection;
