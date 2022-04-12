import * as Yup from "yup";
import { convertFieldErrors } from "../../util/errors";
import { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../generated/graphql-components";
import FormComponent, {
  FormDataType,
  formFieldDescription,
} from "../../components/form/FormComponent";
import { mapObject } from "../../util/transform";
import TitleComponent from "../../components/structure/TitleComponent";
type Props = {};

const Login: FunctionComponent<Props> = ({}) => {
  let navigate = useNavigate();
  const fields = {
    email: {
      type: "text" as "text",
      initialValue: "",
      label: "Email",
      placeholder: "you@example.com",
    },
    password: {
      initialValue: "",
      label: "Password",
      type: "password" as "password",
      placeholder: "password",
    },
  };
  let [formErrors, setFormErrors] = useState(
    mapObject(fields, () => [] as string[])
  );

  let loginValidator = Yup.object({
    email: Yup.string().email("not a valid email").required(),
    password: Yup.string().required(),
  });
  // Login
  let [login, executeLogin] = useLoginMutation();

  let submitLogin = (loginFormValues: FormDataType<typeof fields>) => {
    executeLogin(loginFormValues)
      .then((ret) => {
        if (!ret.data || !ret.data.login) return;
        let {
          data: {
            login: { fieldErrors },
          },
        } = ret;
        if (fieldErrors) {
          let val = convertFieldErrors(fieldErrors);
          Object.keys(val).forEach((key) => {
            formErrors[key as keyof typeof fields] =
              val[key as keyof typeof val]!;
          });
          setFormErrors(formErrors);
        } else {
          navigate("/home");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <FormComponent
        fields={fields}
        onSubmit={submitLogin}
        validatorSchema={loginValidator}
        initialErrors={formErrors}
      >
        <TitleComponent text="Login" />
      </FormComponent>
    </div>
  );
};

export default Login;
