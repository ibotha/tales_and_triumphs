require("dotenv").config();
import express from "express";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";

import Redis from "ioredis";
import { schema } from "./schema";
import { context } from "./context";
import connectRedis from "connect-redis";
import session from "express-session";
import cors from "cors";

const COOKIE_NAME = "session-cookie";

async function startServer() {
  let app = express();

  // Sessions with redis
  const redis = new Redis(process.env.REDIS_URL);
  const RedisStore = connectRedis(session);

  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years,
        httpOnly: true,
        secure: process.env.PROD ? true : false,
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      resave: false,
    })
  );

  // Apollo GraphQL server
  const usePlayground = process.env.USE_PLAYGROUND;

  let plugins = [];
  if (process.env.PROD) {
    plugins.push(ApolloServerPluginLandingPageDisabled());
  } else {
    if (usePlayground)
      plugins.push(ApolloServerPluginLandingPageGraphQLPlayground());
  }

  let server = new ApolloServer({
    schema: schema,
    plugins: plugins,
    context,
  });
  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      origin: process.env.CORS_ORIGIN,
    },
  });

  app.use("/", (req, res) => {
    res.send("hi");
  });
  // Host App
  const port = 4000;

  app.listen({ port }, () => {
    console.log("Apollo server hosted on port " + port);
  });
}

startServer();
