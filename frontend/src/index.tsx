import React from "react";
import * as ReactDOMClient from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { cacheExchange } from "@urql/exchange-graphcache";
import { Client, dedupExchange, fetchExchange, Provider } from "urql";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { exit } from "process";
import LandingPage from "./views/LandingPage";
import Login from "./views/forms/Login";
import Register from "./views/forms/Register";
import World from "./views/World";
import Home from "./views/Home";
import Worlds from "./views/home/Worlds";
import UserManagementView from "./views/world/UserManagementView";
import RedirectToRoot from "./views/world/RedirectToRoot";
import NoteExplorer from "./views/world/NoteExplorer";
import DocumentView from "./views/world/DocumentView";

const client = new Client({
  url: "/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout(_result, args, cache) {
            cache.invalidate("Query");
            cache.invalidate("Mutation");
            cache.invalidate("Query", "me");
          },
          login(
            _result: {
              login: { fieldErrors: { [key: string]: string }[] | null };
            },
            args,
            cache
          ) {
            if (!_result.login.fieldErrors) {
              cache.invalidate("Query", "me");
            }
          },
          assignWorldRole(result, args, cache) {
            cache.invalidate("Query", "world", { id: args.worldId });
          },
          createFolder(result, args, cache) {
            cache.invalidate("Query", "folder", { id: args.parentFolderId });
          },
          updateFolder(result, args, cache) {
            if (args.parentFolderId)
              cache.invalidate("Query", "folder", { id: args.parentFolderId });
          },
          updateDocument(result, args, cache, info) {
            cache.invalidate("Query");
          },
          createDocument(result, args, cache) {
            cache.invalidate("Query", "folder", { id: args.parentFolderId });
          },
          createWorld(result, args, cache) {
            console.log(result);
            cache.invalidate("Query", "myWorlds");
          },
          deleteWorld(result, args, cache) {
            console.log(result);
            cache.invalidate("Query", "myWorlds");
          },
          deleteFolder(result: any, args, cache) {
            console.log(result.deleteFolder.parentFolder.id);
            cache.invalidate("Query", "folder", {
              id: result.deleteFolder.parentFolder.id,
            });
          },
        },
      },
    }),
    fetchExchange,
  ],
});

const container = document.getElementById("root");

if (!container) exit();

const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <Provider value={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="landing/" element={<LandingPage />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route path="world/:worldId" element={<World></World>}>
              <Route path="users" element={<UserManagementView />} />
              <Route path="folder" element={<RedirectToRoot />} />
              <Route path="folder/:folderId" element={<NoteExplorer />} />
              <Route path="document/:documentId" element={<DocumentView />} />
            </Route>
            <Route path="home" element={<Home />}>
              <Route path="worlds" element={<Worlds />} />
            </Route>
            <Route
              path=""
              element={<Navigate to="/landing" replace={true} />}
            />
          </Route>
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
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
