import { FunctionComponent } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useWorldQuery } from "../../generated/graphql-components";

type Props = {};

const RedirectToRoot: FunctionComponent<Props> = ({}) => {
  const params = useParams();
  const [{ data, fetching, error }] = useWorldQuery({
    variables: { id: params.worldId! },
  });

  if (fetching) return <div>Loading...</div>;
  if (!data || !data.world || error) return <div>{JSON.stringify(error)}</div>;

  return <Navigate to={data.world.rootFolder!.id} />;
};

export default RedirectToRoot;
