import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLogoutMutation,
  useMeQuery,
} from "../../generated/graphql-components";

type Props = {};

const LogoutButton: FunctionComponent<Props> = ({}) => {
  const [_, logoutMutation] = useLogoutMutation();

  const navigate = useNavigate();

  const [{ fetching, data, error }] = useMeQuery({});
  if (fetching) return <div>Loading...</div>;
  if (!data || !data.me || error) return <div>{JSON.stringify(error)}</div>;
  return (
    <div
      className="large-link"
      onClick={() =>
        logoutMutation({}).then(() => {
          navigate("/");
        })
      }
    >
      <div className="auto-contrast">
        <slot>
          <span style={{ fontWeight: "bold", color: "black" }}>
            {fetching ? "" : data.me.username + " | "}
          </span>
          Logout
        </slot>
      </div>
    </div>
  );
};

export default LogoutButton;
