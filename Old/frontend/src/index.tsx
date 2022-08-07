import React from "react";
import * as ReactDOMClient from "react-dom/client";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { cacheExchange } from "@urql/exchange-graphcache";
import { refocusExchange } from "@urql/exchange-refocus";
import { Client, dedupExchange, fetchExchange, Provider } from "urql";
import { exit } from "process";
import { DeleteDocumentSectionMutation } from "./generated/graphql-components";

const client = new Client({
  url: "/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    refocusExchange(),
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
            cache.invalidate("Query", "myWorlds");
          },
          deleteWorld(result, args, cache) {
            cache.invalidate("Query", "myWorlds");
          },
          deleteDocumentSection(result, args, cache) {
            const res = result as DeleteDocumentSectionMutation;
            if (res.deleteDocumentSection?.document)
              cache.invalidate("Query", "document", {
                id: res.deleteDocumentSection.document.id,
              });
          },
          deleteFolder(result: any, args, cache) {
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
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
