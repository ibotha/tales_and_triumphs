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
          padding: "0.125em 0.5em",
          color: accentText,
          fontFamily: "inherit",
          fontSize: "1.25rem",
        } as CSSProperties,
        style || {}
      )}
      {...props}
    ></button>
  );
};
