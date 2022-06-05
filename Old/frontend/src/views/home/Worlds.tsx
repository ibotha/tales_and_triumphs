import { FunctionComponent } from "react";
import WorldList from "../../components/world/WorldList";
import CreateWorld from "../CreateWorld";

type Props = {};

const Worlds: FunctionComponent<Props> = ({}) => {
  return (
    <div>
      <h2
        style={{ backgroundColor: "var(--color-background-mute)", margin: "0" }}
      >
        Choose A World
      </h2>
      <WorldList />
      <hr></hr>
      <CreateWorld />
    </div>
  );
};

export default Worlds;
