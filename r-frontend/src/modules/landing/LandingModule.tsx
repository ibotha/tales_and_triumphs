import { useState } from "react";
import logo from "../../resources/Logo.svg";
import { LoginRegister } from "./LoginRegister";

type Props = {};

export const LandingModule = (_: Props) => {
  const [tab, setTab] = useState<undefined | "login" | "register">(undefined);

  return (
    <div>
      <header
        style={{
          textAlign: "center",
        }}
      >
        <img
          style={{
            maxWidth: "90%",
            maxHeight: tab ? "0" : "50vh",
            transition: "max-height 0.25s",
          }}
          src={logo}
          alt="logo"
        ></img>
        <h1>Welcome to Tales & Triumphs</h1>
      </header>
      <main>
        <LoginRegister tab={tab} changeTab={setTab} />
      </main>
    </div>
  );
};
