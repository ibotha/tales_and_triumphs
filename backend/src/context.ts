import { PrismaClient, User } from "@prisma/client";
import { ExpressContext } from "apollo-server-express";
import { Request, Response } from "express";
import { NexusGenObjects } from "../generated/nexus-typegen";
export const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});

prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});

export interface Context {
  // 1
  prisma: PrismaClient;
  req: Request & { session: { user?: User } };
  res: Response;
}

export const context: (context: ExpressContext) => Context = ({ req, res }) => {
  return {
    prisma,
    req,
    res,
  };
};
