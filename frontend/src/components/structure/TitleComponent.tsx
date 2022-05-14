import { FunctionComponent } from "react";

type Props = {
  text: string;
  tag?: string;
  style?: React.CSSProperties;
};

const TitleComponent: FunctionComponent<Props> = ({
  text,
  children,
  style,
  tag,
}) => {
  document.title = "T&T | " + text;
  const TagName = (tag || "h1") as keyof JSX.IntrinsicElements;
  return <TagName style={style}>{children || text}</TagName>;
};

export default TitleComponent;
