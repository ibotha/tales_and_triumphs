import { useState, FunctionComponent } from "react";
import "./structure.scss";

type Props = {
  header: JSX.Element;
  dropdown?: JSX.Element;
  vCentered: boolean;
  rightFraction: string;
};

const SideHeader: FunctionComponent<Props> = ({
  header,
  dropdown,
  vCentered,
  rightFraction,
  children,
}) => {
  let [showDropdown, setShowDropdown] = useState(false);
  return (
    <div
      className="side-header-container"
      style={{ gridTemplateColumns: "1fr 1px " + rightFraction }}
    >
      <header className={vCentered ? "flex" : ""}>
        {header}
        {/* {!!dropdown ? (
        ) : null} */}
        <div className="side-dropdown">
          <hr style={{ marginTop: "1em" }} />
          <div
            className={"dropdown-content " + (!showDropdown ? "hidden" : "")}
          >
            {dropdown}
          </div>
          <div
            className="dropdown-toggle"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Menu
          </div>
        </div>
      </header>
      <hr />
      <main className={vCentered ? "flex" : ""}>{children}</main>
    </div>
  );
};

export default SideHeader;
