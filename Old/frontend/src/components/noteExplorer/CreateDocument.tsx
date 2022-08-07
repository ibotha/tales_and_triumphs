import { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateDocumentMutation } from "../../generated/graphql-components";
import { mapObject } from "../../util/transform";
import FormComponent from "../form/FormComponent";
import TitleComponent from "../structure/TitleComponent";
import "./noteExplorer.scss";

type Props = {
  parentFolderId: string;
  worldId: string;
  onSuccess: () => void;
};

const CreateDocument: FunctionComponent<Props> = ({
  parentFolderId,
  worldId,
  onSuccess,
}) => {
  let navigate = useNavigate();
  const formFields = {
    name: {
      label: "Name",
      type: "text" as "text",
      placeholder: "Cities",
      initialValue: "",
    },
  };
  let [formErrors, setFormErrors] = useState(
    mapObject(formFields, () => [] as string[])
  );

  const [_, createFolder] = useCreateDocumentMutation();

  const submit = (s: any) => {
    createFolder({
      name: s.name,
      parentFolderId: parentFolderId,
      worldId: worldId,
    })
      .then((e) => {
        if (!e.data?.createDocument?.data) return;
        onSuccess();
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="create-folder-container">
      <FormComponent
        fields={formFields}
        onSubmit={submit}
        initialErrors={formErrors}
        header={
          <TitleComponent text="Create Document" tag="h2"></TitleComponent>
        }
      ></FormComponent>
    </div>
  );
};

export default CreateDocument;
