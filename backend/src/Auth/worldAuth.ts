import { Document, DocumentTemplate, Folder } from "@prisma/client";
import { Context } from "../context";
import { eObjectPermission, eObjectTypes, eWorldRole } from "../types";

export const getUserWorldRole = async (
  worldId: string,
  context: Context
): Promise<eWorldRole> => {
  if (!context.req.session.user) return eWorldRole.PUBLIC;
  let userId = context.req.session.user.id;
  let role = await context.prisma.worldRole.findUnique({
    where: { userId_worldId: { worldId, userId } },
  });
  if (!role) return eWorldRole.PUBLIC;
  return role.level;
};

export const userHasWorldRole = async (
  worldId: string,
  level: eWorldRole,
  context: Context
): Promise<boolean> => {
  let userLevel = await getUserWorldRole(worldId, context);
  return userLevel <= level;
};

export const getUserAccessLevelOnObjectAccessControl = async (
  objectAccessControlId: string,
  context: Context
) => {
  if (!context.req.session.user?.id) return eObjectPermission.NONE;
  const objectAccessControl =
    await context.prisma.objectAccessControl.findUnique({
      where: {
        id: objectAccessControlId,
      },
    });
  if (!objectAccessControl) return eObjectPermission.NONE;
  const role = await context.prisma.worldRole.findUnique({
    where: {
      userId_worldId: {
        worldId: objectAccessControl.worldId,
        userId: context.req.session.user.id,
      },
    },
  });
  if (!role) return eObjectPermission.NONE;
  if (role.level >= objectAccessControl.writeAccessLevel)
    return eObjectPermission.WRITE;
  if (role.level >= objectAccessControl.readAccessLevel)
    return eObjectPermission.READ;
  return eObjectPermission.NONE;
};

export const userHasAccessLevelOnObjectAccessControl = async (
  objectAccessControlId: string,
  context: Context,
  level: eObjectPermission
) => {
  const accessLevel = await getUserAccessLevelOnObjectAccessControl(
    objectAccessControlId,
    context
  );
  return accessLevel <= level;
};

export const userHasAccessLevelOnObject = async (
  objectId: string,
  type: eObjectTypes,
  level: eObjectPermission,
  context: Context
) => {
  switch (type) {
    case eObjectTypes.Document:
      const document = await context.prisma.document.findUnique({
        where: { id: objectId },
        select: { objectAccessControlId: true },
      });
      if (!document) return false;
      return userHasAccessLevelOnObjectAccessControl(
        document.objectAccessControlId,
        context,
        level
      );
    case eObjectTypes.DocumentTemplate:
      const template = await context.prisma.documentTemplate.findUnique({
        where: { id: objectId },
        select: { objectAccessControlId: true },
      });
      if (!template) return false;
      return userHasAccessLevelOnObjectAccessControl(
        template.objectAccessControlId,
        context,
        level
      );
    case eObjectTypes.Folder:
      const folder = await context.prisma.folder.findUnique({
        where: { id: objectId },
        select: { objectAccessControlId: true },
      });
      if (!folder) return false;
      return userHasAccessLevelOnObjectAccessControl(
        folder.objectAccessControlId,
        context,
        level
      );
    case eObjectTypes.Section:
      const section = await context.prisma.documentSection.findUnique({
        where: { id: objectId },
        select: { objectAccessControlId: true },
      });
      if (!section) return false;
      return userHasAccessLevelOnObjectAccessControl(
        section.objectAccessControlId,
        context,
        level
      );
  }
};
