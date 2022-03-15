import { Document, DocumentTemplate, Folder } from "@prisma/client";
import { Context } from "../context";

export enum roleLevels {
  ADMIN,
  TRUSTED,
  USER,
  PUBLIC,
}

type userAllowedOptions = {};

export const getUserWorldRole = async (
  worldId: string,
  context: Context
): Promise<roleLevels> => {
  if (!context.req.session.user) return roleLevels.PUBLIC;
  let userId = context.req.session.user.id;
  console.log(`Checking user: ${userId}`);
  let role = await context.prisma.worldRole.findUnique({
    where: { userId_worldId: { worldId, userId } },
  });
  console.log(`Got role: ${role}`);
  if (!role) return roleLevels.PUBLIC;
  return role.level;
};

export const userHasWorldRole = async (
  worldId: string,
  level: number,
  context: Context
): Promise<boolean> => {
  let userLevel = await getUserWorldRole(worldId, context);
  console.log(`UserLevel: ${userLevel} <= ${level}`);
  return userLevel <= level;
};

type ObjectAccessLevel = "READ" | "WRITE" | "NONE";

const getUserAccessLevelOnObject = async (
  object: { worldId: string; accessLevel: number },
  context: Context
): Promise<ObjectAccessLevel | false> => {
  if (!context.req.session.user?.id) throw Error("You must be logged in!");
  let role = await context.prisma.worldRole.findUnique({
    where: {
      userId_worldId: {
        worldId: object.worldId,
        userId: context.req.session.user?.id,
      },
    },
  });
  if (!role)
    throw Error(
      "You do not have permission to access items within this world!"
    );
  if (role.level >= object.accessLevel) return "WRITE";
  return false;
};

const getUserAccessLevelCommon = async (
  id: string,
  type: string,
  context: any
) => {
  let object = await context.prisma[type].findUnique({
    where: { id },
    select: {
      id: true,
      readAccessLevel: true,
      world: { select: { id: true } },
    },
  });
  if (object) {
    if (context.req.session.user) {
      let userAccessLevel = await getUserWorldRole(object.world.id, context);
      if (
        await context.prisma[type].findFirst({
          where: {
            AND: {
              id,
              OR: [
                { edit: { some: { id: context.req.session.user.id } } },
                { writeAccessLevel: { gte: userAccessLevel } },
              ],
            },
          },
        })
      )
        return "WRITE";
      if (
        await context.prisma[type].findFirst({
          where: {
            AND: {
              id,
              OR: [
                { readOnly: { some: { id: context.req.session.user.id } } },
                { readAccessLevel: { gte: userAccessLevel } },
              ],
            },
          },
        })
      )
        return "READ";
    }
    if (object.readAccessLevel === roleLevels.PUBLIC) return "READ";
  }
  return "NONE";
};

export const getUserAccessLevelOnDocument = async (
  id: string,
  context: Context
): Promise<ObjectAccessLevel> => {
  return getUserAccessLevelCommon(id, "document", context);
};

export const getUserAccessLevelOnDocumentTemplate = async (
  id: string,
  context: Context
): Promise<ObjectAccessLevel> => {
  return getUserAccessLevelCommon(id, "documentTemplate", context);
};

export const getUserAccessLevelOnFolder = async (
  id: string,
  context: Context
): Promise<ObjectAccessLevel> => {
  return getUserAccessLevelCommon(id, "folder", context);
};

export const considerAccessLevel = (
  level: ObjectAccessLevel,
  accessLevel: ObjectAccessLevel
) => {
  switch (level) {
    case "READ":
      if (accessLevel === "READ" || accessLevel === "WRITE") return;
      throw Error("Not Enough Permissions");
    case "WRITE":
      if (accessLevel === "WRITE") return;
      throw Error("Not Enough Permissions");
  }
};

type CanAccessFunc = (
  id: string,
  level: ObjectAccessLevel,
  context: Context
) => Promise<boolean>;

export const userCanAccessDocument: CanAccessFunc = async (
  id: string,
  level: ObjectAccessLevel,
  context: Context
): Promise<boolean> => {
  let accessLevel = await getUserAccessLevelOnDocument(id, context);
  considerAccessLevel(level, accessLevel);
  return true;
};

export const userCanAccessDocumentTemplate: CanAccessFunc = async (
  id: string,
  level: ObjectAccessLevel,
  context: Context
): Promise<boolean> => {
  let accessLevel = await getUserAccessLevelOnDocumentTemplate(id, context);
  considerAccessLevel(level, accessLevel);
  return true;
};

export const userCanAccessFolder: CanAccessFunc = async (
  id: string,
  level: ObjectAccessLevel,
  context: Context
): Promise<boolean> => {
  let accessLevel = await getUserAccessLevelOnFolder(id, context);
  considerAccessLevel(level, accessLevel);
  return true;
};
