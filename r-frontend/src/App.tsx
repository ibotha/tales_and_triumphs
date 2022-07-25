import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { AdminModule } from "./modules/admin/AdminModule";
import { LandingModule } from "./modules/landing/LandingModule";
import { WorldModule } from "./modules/world/WorldModule";
import { useGlobalState } from "./stores/GlobalStore";
import { detail, primary, primaryText, secondary } from "./styles/colours";
import logo from "./resources/Logo.svg";
import { GameModule } from "./modules/game/GameModule";
import { WorldStore } from "./modules/world/WorldStore";
import { Button } from "./components/ui/Button";
import { useState } from "react";

function App() {
  const { state: globalState, updater } = useGlobalState();
  const [hidden, setHidden] = useState(false);

  return (
    <div
      style={{
        backgroundColor: primary,
        color: primaryText,
        margin: "0",
        padding: "0",
      }}
      className="App"
    >
      <BrowserRouter>
        {globalState.user ? (
          <div
            style={{
              display: "grid",
              height: "100vh",
              gridTemplateColumns: hidden ? "1fr 5rem" : "1fr 20rem",
            }}
          >
            <main>
              <Routes>
                <Route
                  path="world"
                  element={
                    <WorldStore>
                      <WorldModule />
                    </WorldStore>
                  }
                />
                <Route path="admin" element={<AdminModule />} />
                <Route path="game" element={<GameModule />} />
                <Route path="*" element={<Navigate to="admin" />} />
              </Routes>
            </main>
            <header
              style={{
                height: "100%",
                backgroundColor: secondary,
                display: "grid",
                gridTemplateColumns: "1em auto",
              }}
            >
              <div
                style={{
                  backgroundColor: detail,
                  lineHeight: "100vh",
                  padding: "0 0.25rem",
                }}
                onClick={() => setHidden(!hidden)}
              >
                {hidden ? (
                  <i className="fa fa-angle-double-left" aria-hidden="true"></i>
                ) : (
                  <i
                    className="fa fa-angle-double-right"
                    aria-hidden="true"
                  ></i>
                )}
              </div>
              <div
                style={{
                  padding: "0.25em",
                  height: "100%",
                  fontSize: "2rem",
                  overflowY: "auto",
                  display: "grid",
                  gridTemplateRows: "min-content auto min-content",
                }}
              >
                <div
                  style={{
                    margin: "auto",
                    textAlign: "center",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      maxWidth: "10rem",
                    }}
                    src={logo}
                    alt="logo"
                  ></img>
                  {hidden ? "" : <div>Tales &amp; Triumphs</div>}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gridAutoRows: "2em",
                    justifyContent: "space-between",
                    width: "min-content",
                    margin: "auto",
                    gap: "0.25em",
                  }}
                >
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to="/admin"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <i
                        style={{
                          width: "1.25em",
                          textAlign: "center",
                        }}
                        className="fa fa-cogs"
                        aria-hidden="true"
                      ></i>
                      {hidden ? "" : <span>Admin</span>}
                    </div>
                  </Link>
                  <Link
                    to="/world"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <i
                        style={{ width: "1.25em", textAlign: "center" }}
                        className="fa fa-globe"
                        aria-hidden="true"
                      ></i>
                      {hidden ? "" : <span>World</span>}
                    </div>
                  </Link>
                  <Link
                    to="/game"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <i
                        style={{ width: "1.25em", textAlign: "center" }}
                        className="fa fa-gamepad"
                        aria-hidden="true"
                      ></i>
                      {hidden ? "" : <span>Game</span>}
                    </div>
                  </Link>
                </div>
                <Button
                  style={{
                    width: "100%",
                  }}
                  onClick={() => updater.purge()}
                >
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                  {hidden ? "" : "Logout"}
                </Button>
              </div>
            </header>
          </div>
        ) : (
          <Routes>
            <Route path="landing" element={<LandingModule />} />
            <Route path="*" element={<Navigate to="landing" />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
