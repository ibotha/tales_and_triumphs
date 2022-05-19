import { useState, FunctionComponent } from "react";
import "./structure.scss";

type Props = {
  header: JSX.Element;
  dropdown?: JSX.Element;
  vCentered: boolean;
  rightFraction?: string;
  leftFraction?: string;
};

const SideHeader: FunctionComponent<Props> = ({
  header,
  dropdown,
  vCentered,
  rightFraction,
  leftFraction,
  children,
}) => {
  let [showDropdown, setShowDropdown] = useState(false);
  let [collapsed, setCollapsed] = useState(false);
  return (
    <div
      className={`side-header-container ${collapsed ? "collapsed" : ""}`}
      style={
        {
          "--right-fraction": rightFraction || "3fr",
          "--left-fraction": leftFraction || "1fr",
        } as React.CSSProperties
      }
    >
      <header className={vCentered ? "flex" : ""}>
        {header}
        {!!dropdown ? (
          <div className="side-dropdown" style={{ padding: "0 0.5em" }}>
            <hr style={{ margin: "0.25em 0 0 0" }} />
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
        ) : null}
      </header>
      <div className="divider" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? ">" : "<"}
      </div>
      <main className={vCentered ? "flex" : ""}>{children}</main>
    </div>
  );
};

export default SideHeader;
