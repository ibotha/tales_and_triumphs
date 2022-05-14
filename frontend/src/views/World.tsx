import "./World.scss";
import { FunctionComponent, useState } from "react";
import {
  useDeleteWorldMutation,
  useWorldQuery,
} from "../generated/graphql-components";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import SideHeader from "../components/structure/SideHeader";
import TitleComponent from "../components/structure/TitleComponent";
import LogoutButton from "../components/userControl/LogoutButton";
import ModalComponent from "../components/structure/ModalComponent";
import ConfirmComponent from "../components/structure/ConfirmComponent";

type Props = {};

const World: FunctionComponent<Props> = ({}) => {
  const navigate = useNavigate();
  const params = useParams();
  const [deleteWorldModal, setDeleteWorldModal] = useState(false);

  const [{ data, fetching, error }] = useWorldQuery({
    variables: {
      id: params.worldId!,
    },
  });

  const [_, deleteWorldMutation] = useDeleteWorldMutation();

  const deleteWorld = async (worldId: string) => {
    const res = await deleteWorldMutation({
      worldId,
    });
    if (res.data?.deleteWorld) navigate("/");
  };
  if (!data) return <div>Loading...</div>;
  if (error || !data.world) return <div>{JSON.stringify(error)}</div>;
  return (
    <div className="container">
      <SideHeader
        header={<TitleComponent text={data.world.name} />}
        rightFraction="3fr"
        leftFraction="15em"
        vCentered={false}
        dropdown={
          <div style={{ display: "grid", gap: "0.5em", marginTop: "1em" }}>
            <Link to="/home" className="large-link">
              <div className="auto-contrast">Home</div>
            </Link>
            <LogoutButton />
            <Link className="large-link" to={`/world/${params.worldId}/users`}>
              <div className="auto-contrast">Users</div>
            </Link>
            <Link to={`/world/${params.worldId}/folder`} className="large-link">
              <div className="auto-contrast">Notes</div>
            </Link>
            <Link
              to={`/world/${params.worldId}/categories`}
              className="large-link"
            >
              <div className="auto-contrast">Categories</div>
            </Link>
            <Link
              to={`/world/${params.worldId}/templates`}
              className="large-link"
            >
              <div className="auto-contrast">Templates</div>
            </Link>
            <div
              v-if="data.world.myRole === 'ADMIN'"
              onClick={() => setDeleteWorldModal(true)}
              className="large-link"
              style={{ backgroundColor: "brown" }}
            >
              <div className="auto-contrast">Delete World</div>
            </div>
          </div>
        }
      >
        <Outlet />
      </SideHeader>
      {deleteWorldModal ? (
        <ModalComponent close={() => setDeleteWorldModal(false)}>
          <ConfirmComponent
            no={() => setDeleteWorldModal(false)}
            yes={() => deleteWorld(params.worldId as string)}
          >
            <h2
              style={{
                maxWidth: "30ch",
                textAlign: "center",
                marginBottom: "1em",
              }}
            >
              Are you sure you want to delete your world?
            </h2>
          </ConfirmComponent>
        </ModalComponent>
      ) : null}
    </div>
  );
};

export default World;
