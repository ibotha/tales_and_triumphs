import { Document, DocumentTemplate, Folder } from "@prisma/client";
import { Context } from "../context";

export enum roleLevels {
  ADMIN,
  TRUSTED,
  USER,
}

type userAllowedOptions = {};

export const userHasWorldRole = async (
  worldId: string,
  level: number,
  context: Context
): Promise<boolean> => {
  if (!context.req.session.user) return false;
  let userId = context.req.session.user.id;
  let role = await context.prisma.worldRole.findUnique({
    where: { userId_worldId: { worldId, userId } },
  });
  if (!role) return false;
  if (role.level <= level) return true;
  return false;
};

type ObjectAccessLevel = "READ" | "WRITE";

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
  let obj = await context.prisma[type].findUnique({
    where: { id },
    select: { accessLevel: true, worldId: true },
  });
  if (!obj) throw Error(`Could not find that ${type}!`);
  let accessLevel = await getUserAccessLevelOnObject(obj, context);
  if (accessLevel) return accessLevel;

  let editable = !!(await context.prisma[type].findFirst({
    where: {
      edit: { some: { id: context.req.session.user!.id } },
    },
    select: { id: true },
  }));
  if (editable) return "WRITE";
  let readOnly = !!(await context.prisma[type].findFirst({
    where: {
      readOnly: { some: { id: context.req.session.user!.id } },
    },
    select: { id: true },
  }));
  if (readOnly) return "READ";
  throw Error(`You do not have permissions to access this ${type}!`);
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
  console.log(accessLevel, level);
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
