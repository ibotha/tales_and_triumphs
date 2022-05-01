import "./form.scss";
import * as Yup from "yup";

import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  KeyboardEventHandler,
  ReactNode,
  useState,
} from "react";
import { mapObject } from "../../util/transform";
import FormField from "./FormField";

interface FieldDescription {
  type: "textarea" | "password" | "text" | "radio" | "checkbox" | "colour";
  label?: string;
  placeholder?: string;
}

type TextFieldDescription = {
  type: "textarea" | "password" | "text";
  initialValue?: string;
} & FieldDescription;

type RadioFieldDescription = {
  type: "radio";
  initialValue?: string;
  options: {
    value: string;
    label?: string;
  }[];
} & FieldDescription;

type CheckboxFieldDescription = {
  type: "checkbox";
  initialValue?: boolean;
} & FieldDescription;

type ColourFieldDescription = {
  type: "colour";
  initialValue?: string;
} & FieldDescription;

export type formFieldDescription =
  | TextFieldDescription
  | RadioFieldDescription
  | CheckboxFieldDescription
  | ColourFieldDescription;

export type FormDataType<Description> = {
  [Property in keyof Description]: Description[Property] extends {
    type: "checkbox";
  }
    ? boolean
    : string;
};

type Props<
  FieldsType extends {
    [key: string]: formFieldDescription;
  }
> = {
  fields: FieldsType;
  title?: string;
  validatorSchema?: Yup.AnySchema;
  initialErrors?: {
    [Property in keyof FieldsType]: string[];
  };
  children?: ReactNode | undefined;
  after?: ReactNode | undefined;
  onSubmit: (values: FormDataType<FieldsType>) => void;
};

const FormComponent = <
  FieldsType extends {
    [key: string]: formFieldDescription;
  }
>({
  children,
  after,
  fields,
  title,
  validatorSchema,
  initialErrors,
  onSubmit,
}: Props<FieldsType>) => {
  const [hasErrors, setHasErrors] = useState(false);
  const [formData, setFormData] = useState<FormDataType<FieldsType>>(
    mapObject(fields, (desc) => {
      if (desc.initialValue === undefined)
        return desc.type === "checkbox" ? false : "";
      return desc.initialValue;
    }) as FormDataType<FieldsType>
  );
  const [formErrors, setFormErrors] = useState<{
    [Property in keyof FieldsType]: string[];
  }>(initialErrors || mapObject(fields, () => []));
  const [formTouched, setFormTouched] = useState<{
    [Property in keyof FieldsType]: boolean;
  }>(mapObject(fields, () => false));

  async function validate(formData: FormDataType<FieldsType>) {
    if (!validatorSchema) return;
    const errors: {
      [Property in keyof FieldsType]: string[];
    } = mapObject(fields, () => []);
    try {
      validatorSchema.validateSync(formData, { abortEarly: false });
      setHasErrors(() => false);
    } catch (e: any) {
      let err = e as Yup.ValidationError;
      setHasErrors(() => true);
      if (err.inner) {
        let newErrors = err.inner as Yup.ValidationError[];
        newErrors.forEach((err) => {
          if (!err.path) {
            return;
          }
          let key = err.path as keyof FieldsType;
          errors[key] = errors[key].concat([err.message]);
        });
      }
    }
    setFormErrors(() => errors);
  }

  function setTouched(f: keyof FieldsType) {
    formTouched[f] = true;
    setFormTouched(formTouched);
  }

  let submit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    submitCommon();
  };

  const submitCommon = () => {
    validate(formData);
    if (!hasErrors) {
      onSubmit(formData);
      reset();
    } else {
      setFormTouched(mapObject(fields, () => true));
    }
  };

  function reset() {
    setFormErrors(mapObject(fields, () => []));
    setFormTouched(mapObject(fields, () => false));
  }

  const onKeyUp: KeyboardEventHandler<HTMLFormElement> = (e) => {
    if (e.key == "Enter") submitCommon();
    e.preventDefault();
  };

  return (
    <div className="form-container">
      <form onKeyUp={onKeyUp}>
        {children}
        <hr />
        <div className="fields">
          {Object.keys(fields).map((name: keyof FieldsType) => {
            const field = fields[name];
            const shared = {
              key: name as string,
              name: name as string,
              label: field.label,
              placeholder: field.placeholder,
              onInput: (e: string | boolean) => {},
              onChange: (e: string | boolean) => {
                setTouched(name as string);
                const f = { ...formData };
                console.log("changed", f);
                f[name] = e as FormDataType<FieldsType>[keyof FieldsType];
                setFormData(() => f);
                validate(f);
              },
              onTouched: () => {
                setTouched(name as string);
              },
              errors: formErrors[name],
            };
            switch (field.type) {
              case "radio":
                return (
                  <FormField
                    type={field.type}
                    value={formData[name] as string}
                    options={field.options}
                    {...shared}
                  />
                );
              case "checkbox":
                return (
                  <FormField
                    type={field.type}
                    value={formData[name] as boolean}
                    {...shared}
                  />
                );
              case "colour":
                return (
                  <FormField
                    type={field.type}
                    value={formData[name] as string}
                    {...shared}
                  />
                );
              default:
                return (
                  <FormField
                    type={field.type}
                    value={formData[name] as string}
                    {...shared}
                  />
                );
            }
          })}
          <button className="btn" disabled={hasErrors} onClick={submit}>
            Submit
          </button>
        </div>
        {after}
      </form>
    </div>
  );
};

export default FormComponent;
