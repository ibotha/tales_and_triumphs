import { FunctionComponent } from "react";
import "./noteExplorer.scss";
import tinyColor from "tinycolor2";
import { Link, useNavigate } from "react-router-dom";
import { useFolderQuery } from "../../generated/graphql-components";

type Props = { onUpdateClicked: () => void; folderId: string };

const FolderIcon: FunctionComponent<Props> = ({
  onUpdateClicked,
  folderId,
}) => {
  const navigate = useNavigate();

  const [{ fetching, data, error }] = useFolderQuery({
    variables: {
      id: folderId,
    },
  });

  if (fetching) return <div>Loading...</div>;
  if (!data || !data.folder || error) return <div>{JSON.stringify(error)}</div>;

  let expDarken = (c: tinyColor.Instance) => {
    let l = c.getLuminance();
    return c.darken(Math.max(5, l * 50));
  };

  return (
    <Link
      to={"../folder/" + folderId}
      className="folder hover-bubble"
      style={{
        backgroundColor: data ? data.folder.colour : "#000",
        boxShadow: `1px -3px ${
          data ? `#${expDarken(tinyColor(data.folder.colour)).toHex()}` : "#000"
        }`,
        color: data
          ? tinyColor(data.folder.colour).getLuminance() > 0.4
            ? "var(--vt-c-text-light-1)"
            : "var(--vt-c-text-dark-1)"
          : "#000",
      }}
    >
      <h4 className="folder-name">{data.folder.name}</h4>
      <div
        v-if="data.folder.editable"
        className="folder-settings"
        onClick={(e) => {
          e.preventDefault();
          onUpdateClicked();
        }}
      >
        O
      </div>
    </Link>
  );
};

export default FolderIcon;
