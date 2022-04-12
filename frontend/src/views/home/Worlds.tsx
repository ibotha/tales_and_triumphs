import { FunctionComponent } from "react";
import WorldList from "../../components/world/WorldList";
import CreateWorld from "../CreateWorld";

type Props = {};

const Worlds: FunctionComponent<Props> = ({}) => {
  return (
    <div>
      <WorldList />
      <CreateWorld />
    </div>
  );
};

export default Worlds;
