import * as Yup from "yup";
import { FunctionComponent, useState } from "react";
import { mapObject } from "../../util/transform";
import { useRegisterMutation } from "../../generated/graphql-components";
import { convertFieldErrors } from "../../util/errors";
import { useNavigate } from "react-router-dom";
import FormComponent, {
  formFieldDescription,
} from "../../components/form/FormComponent";
import TitleComponent from "../../components/structure/TitleComponent";

type Props = {};

const Register: FunctionComponent<Props> = ({}) => {
  const navigate = useNavigate();
  const fields = {
    email: {
      type: "text" as "text",
      initialValue: "",
      label: "Email",
      placeholder: "you@example.com",
    },
    username: {
      type: "text" as "text",
      initialValue: "",
      label: "Username",
      placeholder: "DankMaster123",
    },
    password: {
      initialValue: "",
      label: "Password",
      type: "password" as "password",
      placeholder: "password",
    },
    confirmPassword: {
      initialValue: "",
      label: "Confirm Password",
      type: "password" as "password",
      placeholder: "confirm",
    },
  };

  const [initialErrors, setInitialErrors] = useState(
    mapObject(fields, () => [] as string[])
  );

  let registerValidator = Yup.object({
    email: Yup.string().email("not a valid email").required(),
    password: Yup.string().min(12).max(50),
    confirmPassword: Yup.string().test(
      "password",
      "must match password",
      function (confirm) {
        if (this.parent.password !== confirm) return false;
        return true;
      }
    ),
    username: Yup.string()
      .matches(/^[a-zA-Z\d]+$/, "must only contain letters and numbers")
      .min(3)
      .max(30),
  });

  let [_, register] = useRegisterMutation();

  function submitRegister(registerFormValues: {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
  }) {
    let { confirmPassword, ...submitValues } = registerFormValues;
    if (confirmPassword === submitValues.password) {
      register(submitValues)
        .then((ret) => {
          if (!ret.data || !ret.data.register) return;
          let registerData = ret.data.register;
          if (registerData) {
            let { fieldErrors } = registerData;

            if (fieldErrors) {
              let val = convertFieldErrors(fieldErrors);
              Object.keys(val).forEach((key) => {
                initialErrors[key as keyof typeof fields] =
                  val[key as keyof typeof val]!;
              });
              setInitialErrors(initialErrors);
            } else {
              navigate("login");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
    <div style={{ padding: "1em" }}>
      <FormComponent
        fields={fields}
        onSubmit={submitRegister}
        validatorSchema={registerValidator}
        initialErrors={initialErrors}
        header={<TitleComponent text="Register" tag="h2" />}
      ></FormComponent>
    </div>
  );
};

export default Register;
