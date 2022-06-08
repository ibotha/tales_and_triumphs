import _ from "lodash";
import { CSSProperties } from "react";
import { Card } from "../../components/layout/Card";
import { detail, secondaryMute } from "../../styles/colours";
import { Login } from "./Login";
import { Register } from "./Register";

type Props = {
  tab?: "login" | "register";
  changeTab: (tab: "login" | "register") => void;
};

export const LoginRegister = ({ tab, changeTab }: Props) => {
  return (
    <div
      style={{
        maxWidth: "30em",
        margin: "auto",
      }}
    >
      <Card>
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2px 1fr",
            textAlign: "center",
          }}
        >
          <h2
            style={_.merge({
              padding: "0.25em",
            }, tab === "login" ? {} : {
              backgroundColor: secondaryMute,
              boxShadow: '-2px -1px 2px 1px inset rgba(0,0,0,0.4)'
            } as CSSProperties)}
            onClick={() => changeTab("login")}
          >
            Login
          </h2>
          <div style={tab ? {} : { backgroundColor: detail }}></div>
          <h2
            style={_.merge({
              padding: "0.25em",
            }, tab === "register" ? {} : {
              backgroundColor: secondaryMute,
              boxShadow: '2px -1px 2px 1px inset rgba(0,0,0,0.4)'
            } as CSSProperties)}
            onClick={() => changeTab("register")}
          >
            Register
          </h2>
        </header>
        <main
          style={{
            maxHeight: tab ? "100vh" : "0",
            transition: "max-height 0.25s",
            overflow: "hidden",
          }}
        >
          {(() => {
            switch (tab) {
              case "login":
                return <Login />;
              case "register":
                return <Register />;
            }
          })()}
        </main>
      </Card>
    </div>
  );
};
