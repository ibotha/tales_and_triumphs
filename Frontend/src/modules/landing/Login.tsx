import { useFormik } from "formik";
import { FormField } from "../../components/form/FormField";
import { InputField } from "../../components/form/InputField";
import { Button } from "../../components/ui/Button";
import { useGlobalState } from "../../stores/GlobalStore";

type Props = {};

interface IFormValues {
  username: string;
  password: string;
}

export const Login = (_: Props) => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    } as IFormValues,
    onSubmit: (v) => {
      updater.setUser({
        id: "abcdef",
        username: v.username,
      });
    },
  });
  const { updater } = useGlobalState();
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormField label="Username" id="username" error={formik.errors.username}>
        <InputField
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
      </FormField>
      <FormField label="Password" id="password" error={formik.errors.password}>
        <InputField
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
      </FormField>
      <div
        style={{
          padding: "0.5em",
          textAlign: "right",
        }}
      >
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};
