import { useNavigate, useParams } from "react-router-dom";
import { FunctionComponent } from "react";
import { useWorldQuery } from "../../generated/graphql-components";
import Invite from "../../components/world/Invite";

type Props = {};

const UserManagementView: FunctionComponent<Props> = ({}) => {
  const params = useParams();

  const [{ fetching, data, error }] = useWorldQuery({
    variables: {
      id: params.worldId!,
    },
  });

  if (fetching) return <div>Loading...</div>;
  if (!data || !data.world || error) return <div>{JSON.stringify(error)}</div>;
  console.log(data);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        marginBottom: "1em",
      }}
    >
      {data.world.roles.map((role) => {
        return (
          <div key={role.id}>
            <span style={{ fontWeight: "bold", marginRight: "1em" }}>
              {role.user.username}
            </span>
            {role.level}
          </div>
        );
      })}
      <Invite v-if="data.world.myRole === 'ADMIN'" />
    </div>
  );
};

export default UserManagementView;
