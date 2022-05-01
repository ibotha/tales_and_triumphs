import { FunctionComponent } from "react";

type Props = {
  text: string;
  style?: React.CSSProperties;
};

const TitleComponent: FunctionComponent<Props> = ({
  text,
  children,
  style,
}) => {
  document.title = "T&T | " + text;
  return (
    <h1 style={style}>
      <slot>{children || text}</slot>
    </h1>
  );
};

export default TitleComponent;
