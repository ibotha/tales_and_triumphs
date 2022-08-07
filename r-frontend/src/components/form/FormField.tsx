import { PropsWithChildren } from "react";
import { colours } from "../../styles";

type Props = {
  label: string;
  id: string;
  error?: string;
} & PropsWithChildren;

export const FormField = ({ children, id, label, error }: Props) => {
  return (
    <div
      style={{
        borderBottom: `1px solid ${colours.detail}`,
        padding: "0.5em",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <label htmlFor={id}>{label}</label>
        <div style={{ color: colours.error }}>{error}</div>
      </div>
      <div>{children}</div>
    </div>
  );
};
