import { FunctionComponent } from "react";
import { useMeQuery } from "../generated/graphql-components";
import { Link, Outlet, useNavigate } from "react-router-dom";
import SideHeader from "../components/structure/SideHeader";
import TitleComponent from "../components/structure/TitleComponent";
import LogoutButton from "../components/userControl/LogoutButton";

type Props = {};
const Home: FunctionComponent<Props> = ({}) => {
  const navigate = useNavigate();
  const [{ fetching, data, error }] = useMeQuery();
  if (fetching) return <div>Loading...</div>;
  if (!data || !data.me) {
    navigate("/landing");
    return <div></div>;
  }
  return (
    <SideHeader
      header={
        <div style={{ marginBottom: "1em" }}>
          <TitleComponent text="Home">
            Welcome {data.me.username}
          </TitleComponent>
        </div>
      }
      vCentered={false}
      leftFraction="15em"
      rightFraction="3fr"
      dropdown={
        <div style={{ display: "grid", gap: "0.5em", marginTop: "1em" }}>
          <LogoutButton />
          <Link className="large-link" to={`worlds`}>
            <div className="auto-contrast">Worlds</div>
          </Link>
        </div>
      }
    >
      <Outlet />
    </SideHeader>
  );
};

export default Home;
