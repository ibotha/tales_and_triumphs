import { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateTextSectionMutation } from "../../generated/graphql-components";
import { mapObject } from "../../util/transform";
import FormComponent from "../form/FormComponent";
import TitleComponent from "../structure/TitleComponent";

type Props = {
  documentId: string;
  onSuccess: () => void;
};

const CreateSection: FunctionComponent<Props> = ({ documentId, onSuccess }) => {
  const navigate = useNavigate();
  const [_, createTextSection] = useCreateTextSectionMutation();

  const formFields = {
    type: {
      label: "Type",
      type: "radio" as "radio",
      initialValue: "text",
      options: [
        { label: "Text", value: "text" },
        { label: "Character Sheet", value: "characterSheet" },
      ],
    },
  };

  const [formErrors, setFormErrors] = useState(
    mapObject(formFields, () => [] as string[])
  );

  const submit = (s: any) => {
    if (s.type === "text")
      createTextSection({
        documentId: documentId,
      })
        .then((e) => {
          if (!e.data?.createTextSection) return;
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
        <h2>Add Section</h2>
      </FormComponent>
    </div>
  );
};

export default CreateSection;
