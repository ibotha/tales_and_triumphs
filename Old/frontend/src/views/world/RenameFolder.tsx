import { FunctionComponent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormComponent from "../../components/form/FormComponent";
import TitleComponent from "../../components/structure/TitleComponent";
import { useUpdateFolderMutation } from "../../generated/graphql-components";
import { mapObject } from "../../util/transform";
import "../World.scss";

type Props = {
  initialValue: string;
  uid: string;
  onSuccess: () => void;
};

const RenamFolder: FunctionComponent<Props> = ({
  initialValue,
  uid,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const [_, updateFolder] = useUpdateFolderMutation();

  const formFields = {
    name: {
      label: "Name",
      placeholder: "Australia",
      initialValue: initialValue,
      type: "text" as "text",
    },
  };

  let [parentErrors, setParentErrors] = useState(
    mapObject(formFields, () => [] as string[])
  );

  const submit = (s: any) => {
    updateFolder({
      name: s.name,
      id: uid,
    })
      .then((e) => {
        if (!e.data?.updateFolder) return;
        onSuccess();
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="create-world-container">
      <FormComponent
        fields={formFields}
        onSubmit={submit}
        initialErrors={parentErrors}
        after={
          <Link className="btn" to="/home">
            Back
          </Link>
        }
      >
        <h2>Rename Folder</h2>
      </FormComponent>
    </div>
  );
};

export default RenamFolder;
