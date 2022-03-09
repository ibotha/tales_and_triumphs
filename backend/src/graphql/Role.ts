import { User } from "@prisma/client";
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
import {
  roleLevels,
  userCanAccessDocument,
  userCanAccessDocumentTemplate,
  userCanAccessFolder,
  userHasWorldRole,
} from "../Auth/worldAuth";
import { generateErrorType } from "./Errors";

export const WorldRole = objectType({
  name: "WorldRole",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.field("user", {
      type: "User",
      async resolve(parent, args, { prisma }) {
        let user = await prisma.worldRole
          .findUnique({ where: { id: parent.id } })
          .user();
        if (!user) throw Error("Could not find a valid role");
        return user;
      },
    });
    t.nonNull.field("world", {
      type: "World",
      async resolve(parent, args, { prisma }) {
        let user = await prisma.worldRole
          .findUnique({ where: { id: parent.id } })
          .world();
        if (!user) throw Error("Could not find a valid role");
        return user;
      },
    });
    t.nonNull.int("level");
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
    ADMIN: roleLevels.ADMIN,
    TRUSTED: roleLevels.TRUSTED,
    USER: roleLevels.USER,
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

export const Mutation = mutationField((t) => {
  t.field("assignWorldRole", {
    type: "AssignmentPayload",
    args: {
      userId: nonNull(stringArg()),
      worldId: nonNull(stringArg()),
      level: intArg(),
    },
    async resolve(parent, { userId, worldId, level }, context) {
      if (
        !(await userHasWorldRole(
          worldId,
          Math.min(roleLevels.TRUSTED, level || roleLevels.ADMIN),
          context
        ))
      ) {
        return { errors: ["You do not have the right permissions!"] };
      }

      if (!level) {
        context.prisma.worldRole.delete({
          where: { userId_worldId: { userId, worldId } },
        });
        return { data: null };
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
        }),
      };
    },
  });

  t.field("updateAccessControl", {
    type: "Permissions",
    args: {
      item: nonNull(arg({ type: "PermissionItemInput" })),
      level: arg({ type: "RoleLevel" }),
      users: list(arg({ type: "UserPermissionInput" })),
    },
    async resolve(parent, { item, level, users }, context) {
      let accessFunc = userCanAccessDocument;
      let model: any = context.prisma.documentTemplate;
      if (item.type === ePermissionItemType.DOCUMENT_TEMPLATE) {
        accessFunc = userCanAccessDocumentTemplate;
        model = context.prisma.document;
      } else if (item.type === ePermissionItemType.FOLDER) {
        accessFunc = userCanAccessFolder;
        model = context.prisma.folder;
      }
      if (
        (await userCanAccessDocumentTemplate(item.id, "WRITE", context)) !==
        true
      )
        return null;
      let data: any = { accessLevel: level === null ? undefined : level };
      if (users) {
        let editDisconnectIds = users
          .filter((u) => u?.accessLevel !== eUserAccessLevel.WRITE)
          .map((u) => ({ id: u!.id }));
        let editConnectIds = users
          .filter((u) => u?.accessLevel === eUserAccessLevel.WRITE)
          .map((u) => ({ id: u!.id }));
        let readDisconnectIds = users
          .filter((u) => u?.accessLevel !== eUserAccessLevel.READ)
          .map((u) => ({ id: u!.id }));
        let readConnectIds = users
          .filter((u) => u?.accessLevel === eUserAccessLevel.READ)
          .map((u) => ({ id: u!.id }));
        data.edit = {
          disconnect: editDisconnectIds,
          connect: editConnectIds,
        };
        data.readOnly = {
          disconnect: readDisconnectIds,
          connect: readConnectIds,
        };
      }

      let ret = await model.update({
        where: { id: item.id },
        data,
        include: { edit: {}, readOnly: {} },
      });
      console.log(users);
      return {
        item,
        accessLevel: ret.accessLevel,
        userAccessLevels: ret.edit
          .map((u: User) => {
            return { id: u.id, accessLevel: eUserAccessLevel.WRITE };
          })
          .concat(
            ret.readOnly.map((u: User) => {
              return { id: u.id, accessLevel: eUserAccessLevel.READ };
            })
          ),
      };
    },
  });
});
console.log("here");
