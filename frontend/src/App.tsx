import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import LandingPage from "./views/LandingPage";

function App() {
  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

export default App;
