import { PrismaClient, User } from "@prisma/client";
import { ExpressContext } from "apollo-server-express";
import { Request, Response } from "express";
export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  req: Request & { session: { user?: { id: string } } };
  res: Response;
}

export const context: (context: ExpressContext) => Context = ({ req, res }) => {
  return {
    prisma,
    req,
    res,
  };
};
