import { FormEvent, FunctionComponent, useState } from "react";
import tinycolor from "tinycolor2";
import { SwatchesPicker } from "react-color";

interface CommonProps {
  type: "textarea" | "password" | "text" | "checkbox" | "radio" | "colour";
  placeholder?: string;
  label?: string;
  name: string;
  errors: string[];
  touched?: boolean;
  onTouched: () => void;
  options?: {
    value: string;
    label?: string;
  }[];
}

type CheckboxProps = {
  type: "checkbox";
  value: boolean;
  onChange: (val: boolean) => void;
  onInput: (val: boolean) => void;
} & CommonProps;

type RadioProps = {
  type: "radio";
  value: string;
  options: {
    value: string;
    label?: string;
  }[];
  onChange: (val: string) => void;
  onInput: (val: string) => void;
} & CommonProps;

type TextProps = {
  type: "textarea" | "password" | "text";
  value: string;
  onChange: (val: string) => void;
  onInput: (val: string) => void;
} & CommonProps;

type ColourProps = {
  type: "colour";
  value: string;
  onChange: (val: string) => void;
  onInput: (val: string) => void;
} & CommonProps;

type Props = TextProps | RadioProps | CheckboxProps | ColourProps;

const FormField: FunctionComponent<Props> = ({
  onTouched,
  touched,
  label,
  name,
  placeholder,
  errors,
  ...props
}) => {
  const [internalTouched, setInternalTouched] = useState(touched || false);

  const change = (e: FormEvent<HTMLInputElement>) => {
    if (props.type === "checkbox")
      props.onChange(Boolean(e.currentTarget.value));
    else props.onChange(e.currentTarget.value);
    if (touched !== undefined) onTouched();
    else setInternalTouched(true);
  };

  const input = (e: FormEvent<HTMLInputElement>) => {
    if (props.type === "checkbox")
      props.onInput(Boolean(e.currentTarget.value));
    else props.onInput(e.currentTarget.value);
  };

  return (
    <div className="form-field">
      <div className="input-container">
        <div className="label">{label}:</div>
        {(() => {
          if (props.type === "radio") {
            return (
              <div
                className="form-input"
                style={{
                  width: "100%",
                  textAlign: "start",
                  alignItems: "center",
                }}
              >
                {props.options.map((o, i) => {
                  return (
                    <div key={i}>
                      <input
                        id={name! + i}
                        value={o.value}
                        name={name}
                        type="radio"
                        onInput={input}
                        onChange={change}
                      />
                      {o.label ? o.label : o.value}
                    </div>
                  );
                })}
              </div>
            );
          } else if (props.type === "checkbox") {
            return (
              <div
                className="form-input"
                style={{
                  width: "100%",
                  height: "100%",
                  textAlign: "start",
                  alignItems: "center",
                }}
              >
                <input
                  placeholder={placeholder}
                  type={props.type}
                  value={String(props.value)}
                  name={name}
                  onInput={input}
                  onChange={change}
                />
              </div>
            );
          } else if (props.type == "colour") {
            return (
              <SwatchesPicker
                className="form-input"
                color={props.value}
                onChange={(c) => {
                  props.onChange(c.hex);
                }}
                width={240}
              />
            );
          } else {
            return (
              <div
                className="form-input"
                style={{
                  width: "100%",
                  height: "100%",
                  textAlign: "start",
                  alignItems: "center",
                }}
              >
                <input
                  placeholder={placeholder}
                  type={props.type}
                  value={props.value}
                  name={name}
                  onInput={input}
                  onChange={change}
                />
              </div>
            );
          }
        })()}
      </div>
      <div className="errors">
        {(touched === undefined ? internalTouched : touched) ? (
          <div>
            {errors.map((e, i) => {
              <div key={i}>{e}</div>;
            })}{" "}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FormField;
