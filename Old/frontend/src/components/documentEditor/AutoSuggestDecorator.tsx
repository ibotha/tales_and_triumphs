import { FunctionComponent } from "react";

type Props = {
  decoratedText: string;
  blockKey: string;
  start: number;
  end: number;
};

const AutoSuggestionDecorator: FunctionComponent<Props> = ({
  children,
  blockKey,
  start,
  end,
  ...props
}) => {
  return <span id={`${blockKey}-${start}`}>{children}</span>;
};

export default AutoSuggestionDecorator;
