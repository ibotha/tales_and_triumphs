const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Create Express Server
const app = express();

// Configuration
const PORT = 2000;
const HOST = "localhost";
const API_SERVICE_URL = "http://localhost:4000/graphql";

app.use(
  "/graphql",
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
  })
);

app.listen(PORT, HOST, () => {
  console.log("app is listening on " + PORT);
});
