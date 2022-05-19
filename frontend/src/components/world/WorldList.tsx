import { FunctionComponent } from "react";
import { useMyWorldsQuery } from "../../generated/graphql-components";
import "./world.scss";
import WorldSummaryBanner from "./WorldSummaryBanner";

type Props = {};

const WorldList: FunctionComponent<Props> = ({}) => {
  const [{ fetching, data, error }] = useMyWorldsQuery();

  if (fetching) return <div>Loading...</div>;
  if (!data || !data.myWorlds || error)
    return <div>{JSON.stringify(error)}</div>;
  return (
    <div className="banner-list" style={{ display: "grid", gap: "0.5em" }}>
      {data.myWorlds.map((world) => (
        <WorldSummaryBanner key={world.id} uuid={world.id} />
      ))}
    </div>
  );
};

export default WorldList;
