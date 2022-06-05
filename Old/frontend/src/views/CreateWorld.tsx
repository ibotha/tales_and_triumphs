import { FunctionComponent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormComponent from "../components/form/FormComponent";
import TitleComponent from "../components/structure/TitleComponent";
import { useCreateWorldMutation } from "../generated/graphql-components";
import { mapObject } from "../util/transform";
import "./World.scss";

type Props = {};

const CreateWorld: FunctionComponent<Props> = ({}) => {
  const navigate = useNavigate();
  const params = useParams();
  const [_, createWorld] = useCreateWorldMutation();

  const formFields = {
    name: {
      label: "Name",
      placeholder: "Australia",
      initialValue: "",
      type: "text" as "text",
    },
  };

  let [parentErrors, setParentErrors] = useState(
    mapObject(formFields, () => [] as string[])
  );

  const submit = (s: any) => {
    createWorld({
      name: s.name,
    })
      .then((e) => {
        if (!e.data?.createWorld?.data) return;
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="create-world-container">
      <FormComponent
        fields={formFields}
        onSubmit={submit}
        initialErrors={parentErrors}
        header={<TitleComponent text="Create World" tag="h2"></TitleComponent>}
      ></FormComponent>
    </div>
  );
};

export default CreateWorld;
