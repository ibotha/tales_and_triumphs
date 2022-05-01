import { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateFolderMutation } from "../../generated/graphql-components";
import { mapObject } from "../../util/transform";
import FormComponent, { formFieldDescription } from "../form/FormComponent";
import TitleComponent from "../structure/TitleComponent";
import "./noteExplorer.scss";

type Props = {
  parentFolderId: string;
  worldId: string;
  onSuccess: () => void;
};

const CreateFolder: FunctionComponent<Props> = ({
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

  const [_, createFolder] = useCreateFolderMutation();

  const submit = (s: any) => {
    createFolder({
      name: s.name,
      parentFolderId: parentFolderId,
      worldId: worldId,
    })
      .then((e) => {
        if (!e.data?.createFolder?.data) return;
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
      >
        <TitleComponent text="Create Folder"> </TitleComponent>
      </FormComponent>
    </div>
  );
};

export default CreateFolder;
