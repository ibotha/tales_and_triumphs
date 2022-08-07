import _ from "lodash";
import { CSSProperties } from "react";
import { detail } from "../../styles/colours";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const InputField = ({ style, ...props }: Props) => {
  return (
    <input
      style={_.merge(
        {
          background: "none",
          outline: "none",
          border: "none",
          color: "inherit",
          borderBottom: `2px solid ${detail}`,
        } as CSSProperties,
        style || {}
      )}
      {...props}
    />
  );
};
