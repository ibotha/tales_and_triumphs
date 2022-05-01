import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import {
  useDeleteDocumentSectionMutation,
  useDocumentSectionQuery,
} from "../../generated/graphql-components";
import Permissions from "../noteExplorer/Permissions";
import "./documentEditor.scss";
import TextSection from "./TextSection";

type Props = {
  sectionId: string;
};

const Section: FunctionComponent<Props> = ({ sectionId }) => {
  const params = useParams();
  const [{ fetching, data, error }] = useDocumentSectionQuery({
    variables: {
      id: sectionId!,
    },
  });

  const [, deleteSection] = useDeleteDocumentSectionMutation();
  if (fetching) return <div>Loading...</div>;
  if (!data || !data.documentSection || error)
    return <div>{JSON.stringify(error)}</div>;
  return (
    <div className="section-container">
      <div>
        {(() => {
          switch (data.documentSection.type) {
            case "Text":
              return (
                <TextSection
                  uid={data.documentSection.textSection!.id}
                ></TextSection>
              );
          }
        })()}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "auto 5em" }}>
        <Permissions
          objectAccessControlId={data.documentSection.objectAccessControl.id}
          worldId={params.worldId!}
        ></Permissions>
        <div
          className="btn negative"
          style={{ height: "fit-content", padding: 0 }}
          onClick={() => deleteSection({ sectionId: sectionId })}
        >
          Delete
        </div>
      </div>
    </div>
  );
};

export default Section;
