import { FunctionComponent } from "react";

type Props = {
  text: string;
};

const TitleComponent: FunctionComponent<Props> = ({ text, children }) => {
  document.title = "T&T | " + text;
  return (
    <h1>
      <slot>{children || text}</slot>
    </h1>
  );
};

export default TitleComponent;
