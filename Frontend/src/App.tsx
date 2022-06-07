import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LandingModule } from "./modules/landing/LandingModule";
import { WorldModule } from "./modules/world/WorldModule";
import { useGlobalState } from "./stores/GlobalStore";
import { primary, primaryText } from "./styles/colours";

function App() {
  const { state: globalState } = useGlobalState();

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
        <Routes>
          {globalState.user ? (
            <>
              <Route path="world" element={<WorldModule />} />
              <Route path="admin" element={<WorldModule />} />
              <Route path="*" element={<Navigate to="admin" />} />
            </>
          ) : (
            <>
              <Route path="landing" element={<LandingModule />} />
              <Route path="*" element={<Navigate to="landing" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
