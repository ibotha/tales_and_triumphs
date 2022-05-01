import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import LandingPage from "./views/LandingPage";
import Worlds from "./views/home/Worlds";
import Home from "./views/Home";
import World from "./views/World";
import UserManagementView from "./views/world/UserManagementView";
import RedirectToRoot from "./views/world/RedirectToRoot";
import NoteExplorer from "./views/world/NoteExplorer";
import DocumentView from "./views/world/DocumentView";
import Login from "./views/forms/Login";
import Register from "./views/forms/Register";
import { useMeQuery } from "./generated/graphql-components";

function App() {
  const [{ fetching, data, error }] = useMeQuery();

  if (fetching) return <div>Loading...</div>;

  if (!data || !data.me) {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/landing/" element={<LandingPage />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route
              path=""
              element={<Navigate to="/landing" replace={true} />}
            />
            <Route
              path="*"
              element={
                <div>
                  404 <Link to="/landing">Go Back</Link>
                </div>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
      </div>
    );
  } else {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/world/:worldId" element={<World />}>
              <Route path="users" element={<UserManagementView />} />
              <Route path="folder" element={<RedirectToRoot />} />
              <Route path="folder/:folderId" element={<NoteExplorer />} />
              <Route path="document/:documentId" element={<DocumentView />} />
              <Route path="" element={<Navigate to="folder" />} />
            </Route>
            <Route path="/home" element={<Home />}>
              <Route path="worlds" element={<Worlds />} />
              <Route path="" element={<Navigate to="worlds" />} />
            </Route>
            <Route path="/" element={<Navigate to="/home" replace={true} />} />
            <Route
              path="*"
              element={
                <div>
                  404 <Link to="/home">Go Back</Link>
                </div>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
