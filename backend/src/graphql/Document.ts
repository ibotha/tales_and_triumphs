import { Prisma } from "@prisma/client";
import {
  arg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import {
  getUserAccessLevelOnDocument,
  roleLevels,
  userCanAccessDocument,
  userHasWorldRole,
} from "../Auth/worldAuth";
import { generateSelect } from "../Util/select";
import { generateErrorType } from "./Errors";

export const DocumentWrapper = generateErrorType({
  name: "DocumentWrapper",
  wrappedType: "Document",
});

export const Document = objectType({
  name: "Document",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.nonNull.list.nonNull.field("edit", { type: "User" });
    t.nonNull.list.nonNull.field("readOnly", { type: "User" });
    t.nonNull.field("readAccessLevel", { type: "RoleLevel" });
    t.nonNull.field("writeAccessLevel", { type: "RoleLevel" });
    t.nonNull.boolean("editable", {
      resolve: async (parent, _, context) => {
        return (
          (await getUserAccessLevelOnDocument(parent.id, context)) === "WRITE"
        );
      },
    });
    t.nonNull.string("content");
    t.field("category", {
      type: "DocumentCategory",
    });
    t.nonNull.field("world", {
      type: "World",
    });
    t.field("parentFolder", {
      type: "Folder",
    });
    t.field("creator", {
      type: "User",
    });
  },
});

export const documentMutation = mutationField((t) => {
  t.field("createDocument", {
    type: "DocumentWrapper",
    args: {
      name: nonNull(stringArg()),
      content: stringArg(),
      parentFolderId: stringArg(),
      categoryId: stringArg(),
      worldId: nonNull(stringArg()),
    },
    async resolve(
      parent,
      { name, content, worldId, parentFolderId, categoryId },
      context,
      info
    ) {
      let select = generateSelect<Prisma.DocumentSelect>()(
        info,
        { id: true },
        "data"
      );
      if (
        !(await userHasWorldRole(worldId, Math.min(roleLevels.USER), context))
      ) {
        throw Error("You do not have the right permissions!");
      }
      let role = await context.prisma.worldRole.findUnique({
        where: {
          userId_worldId: { userId: context.req.session.user!.id, worldId },
        },
      });
      return {
        data: await context.prisma.document.create({
          data: {
            name,
            content: content || undefined,
            parentFolderId: parentFolderId || undefined,
            categoryId: categoryId || undefined,
            worldId,
            creatorId: role?.userId,
            edit: {
              connect: {
                id: role?.userId,
              },
            },
          },
          ...select,
        }),
      };
    },
  });

  t.field("updateDocument", {
    type: "Document",
    args: {
      id: nonNull(stringArg()),
      content: stringArg(),
      parentFolderId: stringArg(),
      categoryId: stringArg(),
      name: stringArg(),
      revokeUsers: list(nonNull(stringArg())),
      newReadOnlyUsers: list(nonNull(stringArg())),
      newEditorUsers: list(nonNull(stringArg())),
      readAccessLevel: arg({ type: "RoleLevel" }),
      writeAccessLevel: arg({ type: "RoleLevel" }),
    },
    resolve: async (
      parent,
      {
        id,
        content,
        name,
        parentFolderId,
        categoryId,
        revokeUsers,
        readAccessLevel,
        newReadOnlyUsers,
        newEditorUsers,
        writeAccessLevel,
      },
      context,
      info
    ) => {
      let select = generateSelect<Prisma.DocumentSelect>()(info, { id: true });
      let authRes = await userCanAccessDocument(id, "WRITE", context);
      if (authRes !== true) return null;

      let editRevokeList: { id: string }[] = [];
      let editConnectList: { id: string }[] = [];
      let readOnlyRevokeList: { id: string }[] = [];
      let readOnlyConnectList: { id: string }[] = [];

      if (revokeUsers) {
        console.log("RevokeUsers: ", revokeUsers);
        editRevokeList = editRevokeList.concat(
          revokeUsers.map((e) => ({ id: e }))
        );
        readOnlyRevokeList = readOnlyRevokeList.concat(
          revokeUsers.map((e) => ({ id: e }))
        );
      }

      if (newEditorUsers) {
        editConnectList = editConnectList.concat(
          newEditorUsers.map((e) => ({ id: e }))
        );
        readOnlyRevokeList = readOnlyRevokeList.concat(
          newEditorUsers.map((e) => ({ id: e }))
        );
      }

      if (newReadOnlyUsers) {
        editRevokeList = editRevokeList.concat(
          newReadOnlyUsers.map((e) => ({ id: e }))
        );
        readOnlyConnectList = readOnlyConnectList.concat(
          newReadOnlyUsers.map((e) => ({ id: e }))
        );
      }

      let ret = await context.prisma.document.update({
        where: { id },
        data: {
          content: content || undefined,
          name: name || undefined,
          parentFolderId: parentFolderId || undefined,
          categoryId: categoryId || undefined,
          readAccessLevel:
            readAccessLevel === null || readAccessLevel === undefined
              ? undefined
              : readAccessLevel,
          writeAccessLevel:
            writeAccessLevel === null || writeAccessLevel === undefined
              ? undefined
              : writeAccessLevel,
          edit: { disconnect: editRevokeList, connect: editConnectList },
          readOnly: {
            disconnect: readOnlyRevokeList,
            connect: readOnlyConnectList,
          },
        },
        ...select,
      });
      return ret;
    },
  });

  t.field("deleteDocument", {
    type: "Boolean",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (parent, { id }, context) => {
      let authRes = await userCanAccessDocument(id, "WRITE", context);
      if (authRes !== true) return null;
      let ret = await context.prisma.document.delete({
        where: { id },
        select: { id: true },
      });
      return !!ret;
    },
  });
});

export const documentQuery = queryField((t) => {
  t.field("document", {
    type: "Document",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (parent, { id }, context, info) => {
      let select = generateSelect<Prisma.DocumentSelect>()(info, { id: true });
      let authRes = await userCanAccessDocument(id, "READ", context);
      if (authRes !== true) return null;
      return context.prisma.document.findUnique({ where: { id }, ...select });
    },
  });

  t.nonNull.list.nonNull.field("documents", {
    type: "Document",
    args: {
      worldId: nonNull(stringArg()),
    },
    resolve(parent, { worldId }, context, info) {
      let select = generateSelect<Prisma.DocumentSelect>()(info, { id: true });
      return context.prisma.document.findMany({
        where: { worldId },
        ...select,
      });
    },
  });
});
