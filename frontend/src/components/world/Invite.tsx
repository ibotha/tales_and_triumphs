import { FunctionComponent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAssignUserRoleMutation } from "../../generated/graphql-components";
import { mapObject } from "../../util/transform";
import FormComponent from "../form/FormComponent";
import TitleComponent from "../structure/TitleComponent";

type Props = {};

const Invite: FunctionComponent<Props> = ({}) => {
  const params = useParams();
  const navigate = useNavigate();
  const [_, assignRole] = useAssignUserRoleMutation();

  const formFields = {
    email: {
      label: "Email",
      placeholder: "hoiti@toiti.com",
      initialValue: "",
      type: "text" as "text",
    },
    level: {
      label: "Role",
      placeholder: "hoiti@toiti.com",
      type: "radio" as "radio",
      options: [
        { label: "Admin", value: "ADMIN" },
        { label: "Trusted", value: "TRUSTED" },
        { label: "User", value: "USER" },
        { label: "None", value: "" },
      ],
    },
  };

  let [parentErrors, setParentErrors] = useState(
    mapObject(formFields, () => [] as string[])
  );

  const submit = (s: any) => {
    assignRole({
      email: s.email,
      worldId: params.worldId!,
      level: s.level.length > 0 ? s.level : null,
    })
      .then((e) => {})
      .catch((err) => console.log(err));
  };

  return (
    <div className="invite-container">
      <FormComponent
        fields={formFields}
        onSubmit={submit}
        initialErrors={parentErrors}
        header={
          <TitleComponent
            text="Invite / Modify"
            tag="h2"
            style={{ margin: "0" }}
          ></TitleComponent>
        }
      ></FormComponent>
    </div>
  );
};

export default Invite;
