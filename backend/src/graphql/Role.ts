import { Prisma, User } from "@prisma/client";
import {
  arg,
  enumType,
  inputObjectType,
  intArg,
  list,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { userHasWorldRole } from "../Auth/worldAuth";
import { eWorldRole } from "../types";
import { generateSelection } from "../Util/select";
import { generateErrorType } from "./Errors";

export const WorldRole = objectType({
  name: "WorldRole",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.field("user", { type: "User" });
    t.nonNull.field("world", { type: "World" });
    t.nonNull.field("level", { type: "RoleLevel" });
  },
});

export const AssignmentPayload = generateErrorType({
  name: "AssignmentPayload",
  wrappedType: "WorldRole",
});

enum ePermissionItemType {
  DOCUMENT = 1,
  FOLDER = 2,
  DOCUMENT_TEMPLATE = 3,
}
export const PermissionItemType = enumType({
  name: "PermissionItemType",
  members: {
    DOCUMENT: ePermissionItemType.DOCUMENT,
    FOLDER: ePermissionItemType.FOLDER,
    DOCUMENT_TEMPLATE: ePermissionItemType.DOCUMENT_TEMPLATE,
  },
});

export const RoleLevel = enumType({
  name: "RoleLevel",
  members: {
    ADMIN: eWorldRole.ADMIN,
    TRUSTED: eWorldRole.TRUSTED,
    USER: eWorldRole.USER,
    PUBLIC: eWorldRole.PUBLIC,
  },
});

enum eUserAccessLevel {
  WRITE = 1,
  READ = 2,
}
export const UserAccessLevel = enumType({
  name: "UserAccessLevel",
  members: {
    WRITE: eUserAccessLevel.WRITE,
    READ: eUserAccessLevel.READ,
  },
});

export const PermissionItemInput = inputObjectType({
  name: "PermissionItemInput",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.field("type", { type: "PermissionItemType" });
  },
});

export const PermissionItem = objectType({
  name: "PermissionItem",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.field("type", { type: "PermissionItemType" });
  },
});

export const UserPermission = objectType({
  name: "UserPermission",
  definition(t) {
    t.nonNull.id("id");
    t.field("accessLevel", { type: "UserAccessLevel" });
  },
});

export const UserPermissionInput = inputObjectType({
  name: "UserPermissionInput",
  definition(t) {
    t.nonNull.id("id");
    t.field("accessLevel", { type: "UserAccessLevel" });
  },
});

export const Permissions = objectType({
  name: "Permissions",
  definition(t) {
    t.id("id");
    t.nonNull.field("item", {
      type: "PermissionItem",
    });
    t.nonNull.field("accessLevel", { type: "RoleLevel" });
    t.nonNull.list.nonNull.field("userAccessLevels", {
      type: "UserPermission",
    });
  },
});

export const RoleMutation = mutationField((t) => {
  t.field("assignWorldRole", {
    type: "AssignmentPayload",
    args: {
      userId: stringArg(),
      userEmail: stringArg(),
      worldId: nonNull(stringArg()),
      level: arg({ type: "RoleLevel" }),
    },
    async resolve(
      parent,
      { userEmail, userId, worldId, level },
      context,
      info
    ) {
      const select = generateSelection<"Role">(info, "data");
      if (
        !(await userHasWorldRole(
          worldId,
          Math.min(eWorldRole.TRUSTED, level || eWorldRole.ADMIN),
          context
        ))
      ) {
        return { errors: ["You do not have the right permissions!"] };
      }
      if (!userId && !userEmail)
        return { errors: ["You must provide either a username or email"] };

      if (userEmail) {
        let user = await context.prisma.user.findUnique({
          where: { email: userEmail },
        });
        if (!user)
          return {
            fieldErrors: [
              { field: "email", message: "Could not find that email" },
            ],
          };
        userId = user.id;
      }

      if (!userId) return { errors: ["No valid userId"] };

      if (level === null || level === undefined) {
        let u = await context.prisma.worldRole.delete({
          where: { userId_worldId: { userId, worldId } },
        });
        if (!u) {
          return { data: null };
        }
        return { data: u };
      }

      return {
        data: context.prisma.worldRole.upsert({
          where: {
            userId_worldId: {
              worldId,
              userId,
            },
          },
          update: {
            level,
          },
          create: {
            worldId,
            userId,
            level,
          },
          ...select,
        }),
      };
    },
  });
});
