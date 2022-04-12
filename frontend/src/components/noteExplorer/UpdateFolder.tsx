import { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Folder,
  useUpdateFolderMutation,
} from "../../generated/graphql-components";
import { mapObject } from "../../util/transform";
import FormComponent from "../form/FormComponent";
import TitleComponent from "../structure/TitleComponent";

type Props = {
  folder: {
    id: string;
    name: string;
    colour: string;
  };
  onSuccess: () => void;
};

const UpdateFolder: FunctionComponent<Props> = ({ folder, onSuccess }) => {
  const navigate = useNavigate();
  const [_, updateFolder] = useUpdateFolderMutation();

  const formFields = {
    name: {
      label: "Name",
      type: "text" as "text",
      placeholder: "Jensin",
      initialValue: folder.name,
    },
    colour: {
      type: "colour" as "colour",
      label: "Colour",
      initialValue: folder.colour,
    },
  };

  const [formErrors, setFormErrors] = useState(
    mapObject(formFields, () => [] as string[])
  );

  const submit = (s: any) => {
    console.log(s);
    updateFolder({
      name: s.name,
      id: folder.id,
      colour: s.colour,
    })
      .then((e) => {
        if (!e.data?.updateFolder) return;
        onSuccess();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="update-folder-container">
      <FormComponent
        fields={formFields}
        onSubmit={submit}
        initialErrors={formErrors}
      >
        <TitleComponent text="Update Folder"> </TitleComponent>
      </FormComponent>
    </div>
  );
};

export default UpdateFolder;
