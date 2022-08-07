import React from "react";
import { Link, Outlet } from "react-router-dom";
import SideHeader from "../components/structure/SideHeader";

type Props = {};

function LandingPage({}: Props) {
  return (
    <SideHeader
      vCentered={true}
      rightFraction="1fr"
      header={
        <nav style={{ margin: "auto", marginTop: "minmax(2em, auto)" }}>
          <h1 style={{ marginBottom: "1em" }}>
            Welcome <br />
            to Tales & Triumphs
          </h1>
          <Link className="btn" to="login">
            login
          </Link>
          <Link className="btn" to="register">
            register
          </Link>
        </nav>
      }
    >
      <Outlet />
    </SideHeader>
  );
}

export default LandingPage;
