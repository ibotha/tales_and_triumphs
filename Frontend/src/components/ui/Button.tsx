import _ from "lodash";
import { CSSProperties } from "react";
import { accent, accentText } from "../../styles/colours";

export const Button = ({
  style,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      style={_.merge(
        {
          backgroundColor: accent,
          border: "none",
          padding: "0.25em 0.5em",
          color: accentText,
          fontFamily: "inherit",
          fontSize: "inherit",
        } as CSSProperties,
        style || {}
      )}
      {...props}
    ></button>
  );
};
