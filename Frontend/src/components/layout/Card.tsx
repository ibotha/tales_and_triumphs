import { CSSProperties, PropsWithChildren } from "react";
import _ from "lodash";
import { secondary } from "../../styles/colours";

type Props = {
  style?: CSSProperties;
} & PropsWithChildren;

export const Card = ({ style, children }: Props) => {
  return (
    <div
      style={_.merge(
        {
          backgroundColor: secondary,
          margin: "0.5em",
        } as CSSProperties,
        style
      )}
    >
      {children}
    </div>
  );
};
