import { FunctionComponent } from "react";
import TitleComponent from "../components/structure/TitleComponent";

type Props = {};

const NotFound: FunctionComponent<Props> = ({}) => {
  return (
    <div>
      <TitleComponent text="404" />
    </div>
  );
};

export default NotFound;
