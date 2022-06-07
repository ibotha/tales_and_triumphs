import { Card } from "../../components/layout/Card";
import { detail } from "../../styles/colours";
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
            style={{
              padding: "0.25em",
              backgroundColor: tab === "login" ? detail : "",
            }}
            onClick={() => changeTab("login")}
          >
            Login
          </h2>
          <div style={{ backgroundColor: detail }}></div>
          <h2
            style={{
              padding: "0.25em",
              backgroundColor: tab === "register" ? detail : "",
            }}
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
