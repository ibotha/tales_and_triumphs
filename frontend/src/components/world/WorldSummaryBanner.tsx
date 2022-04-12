import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { useWorldQuery } from "../../generated/graphql-components";
import "./world.scss";

type Props = {
  uuid: string;
};

const WorldSummaryBanner: FunctionComponent<Props> = ({ uuid }) => {
  const navigate = useNavigate();
  const [{ fetching, data, error }] = useWorldQuery({
    variables: {
      id: uuid,
    },
  });

  console.log(fetching, data);

  if (fetching) return <div>Loading...</div>;
  if (!data || !data.world || error) return <div>{JSON.stringify(error)}</div>;
  return (
    <div onClick={() => navigate("/world/" + uuid)} className="summary-banner">
      <h3>{data.world.name}</h3>
    </div>
  );
};

export default WorldSummaryBanner;
