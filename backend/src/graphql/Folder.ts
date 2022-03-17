import {
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
  list,
  arg,
} from "nexus";
import {
  getUserAccessLevelOnFolder,
  roleLevels,
  userCanAccessFolder,
  userHasWorldRole,
} from "../Auth/worldAuth";
import { generateErrorType } from "./Errors";

export const FolderWrapper = generateErrorType({
  name: "FolderWrapper",
  wrappedType: "Folder",
});

export const Folder = objectType({
  name: "Folder",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.nonNull.string("colour");
    t.nonNull.list.nonNull.field("editors", {
      type: "User",
      resolve: async (parent, _, context) => {
        return context.prisma.folder
          .findUnique({ where: { id: parent.id } })
          .edit();
      },
    });
    t.nonNull.list.nonNull.field("readers", {
      type: "User",
      resolve: async (parent, _, context) => {
        return context.prisma.folder
          .findUnique({ where: { id: parent.id } })
          .readOnly();
      },
    });
    t.nonNull.field("readAccessLevel", { type: "RoleLevel" });
    t.nonNull.field("writeAccessLevel", { type: "RoleLevel" });
    t.nonNull.boolean("editable", {
      resolve: async (parent, _, context) => {
        return (
          (await getUserAccessLevelOnFolder(parent.id, context)) === "WRITE"
        );
      },
    });
    t.string("worldId");
    t.nonNull.field("world", {
      type: "World",
      async resolve(parent, _, context) {
        let res = await context.prisma.document
          .findUnique({
            where: { id: parent.id },
          })
          .world();
        return res!;
      },
    });
    t.nonNull.list.nonNull.field("documents", {
      type: "Document",
      async resolve(parent, _, context) {
        let userId = context.req.session.user?.id;
        let user = await context.prisma.user.findUnique({
          where: { id: userId },
          include: { roles: { where: { worldId: parent.worldId! } } },
        });
        let res = await context.prisma.document.findMany({
          where: {
            AND: {
              parentFolderId: parent.id,
              OR: [
                { readOnly: { some: { id: userId } } },
                { edit: { some: { id: userId } } },
                {
                  readAccessLevel: {
                    gte: user ? user.roles[0].level : roleLevels.PUBLIC,
                  },
                },
              ],
            },
          },
        });
        return res;
      },
    });
    t.string("parentFolderId");
    t.field("parentFolder", {
      type: "Folder",
      resolve: (parent, _, context) => {
        if (!parent.parentFolderId) return null;
        return context.prisma.folder.findUnique({
          where: { id: parent.parentFolderId },
        });
      },
    });
    t.nonNull.list.nonNull.field("subfolders", {
      type: "Folder",
      async resolve(parent, _, context) {
        let userId = context.req.session.user?.id;
        let user = await context.prisma.user.findUnique({
          where: { id: userId },
          include: { roles: { where: { worldId: parent.worldId! } } },
        });
        let res = await context.prisma.folder.findMany({
          where: {
            AND: {
              parentFolderId: parent.id,
              OR: [
                { readOnly: { some: { id: userId } } },
                { edit: { some: { id: userId } } },
                {
                  readAccessLevel: {
                    gte: user ? user.roles[0].level : roleLevels.PUBLIC,
                  },
                },
              ],
            },
          },
        });
        return res!;
      },
    });
    t.field("creator", {
      type: "User",
      resolve(parent, _, context) {
        return context.prisma.document
          .findUnique({
            where: { id: parent.id },
          })
          .creator();
      },
    });
  },
});

export const folderMutation = mutationField((t) => {
  t.field("createFolder", {
    type: "FolderWrapper",
    args: {
      name: nonNull(stringArg()),
      colour: stringArg(),
      parentFolderId: nonNull(stringArg()),
      worldId: nonNull(stringArg()),
    },
    async resolve(parent, { name, colour, worldId, parentFolderId }, context) {
      if (!(await userCanAccessFolder(parentFolderId, "WRITE", context))) {
        throw Error("You do not have the right permissions!");
      }
      let role = await context.prisma.worldRole.findUnique({
        where: {
          userId_worldId: { userId: context.req.session.user!.id, worldId },
        },
      });
      let folder = await context.prisma.folder.create({
        data: {
          name,
          colour: colour || undefined,
          parentFolderId: parentFolderId,
          worldId,
          creatorId: role?.userId,
          edit: {
            connect: {
              id: role?.userId,
            },
          },
        },
      });
      return { data: folder };
    },
  });

  t.field("updateFolder", {
    type: "Folder",
    args: {
      id: nonNull(stringArg()),
      colour: stringArg(),
      parentFolderId: stringArg(),
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
        colour,
        name,
        parentFolderId,
        revokeUsers,
        newEditorUsers,
        newReadOnlyUsers,
        readAccessLevel,
        writeAccessLevel,
      },
      context
    ) => {
      let authRes = await userCanAccessFolder(id, "WRITE", context);
      if (authRes !== true) return null;
      let folder = await context.prisma.folder.findUnique({ where: { id } });
      if (!folder?.parentFolderId) return null;

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
      console.log("editRevokeList: ", editRevokeList);
      console.log("editConnectList: ", editConnectList);
      console.log("readOnlyRevokeList: ", readOnlyRevokeList);
      console.log("readOnlyConnectList: ", readOnlyConnectList);

      let ret = await context.prisma.folder.update({
        where: { id },
        data: {
          colour: colour || undefined,
          name: name || undefined,
          parentFolderId: parentFolderId || undefined,
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
      });
      return ret;
    },
  });

  t.field("deleteFolder", {
    type: "Folder",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (parent, { id }, context) => {
      let authRes = await userCanAccessFolder(id, "WRITE", context);
      if (authRes !== true) return null;
      let folder = await context.prisma.folder.findUnique({
        where: { id },
      });
      console.log(folder);
      if (folder?.parentFolderId === null) return null;

      let ret = await context.prisma.folder.delete({
        where: { id },
      });
      return ret;
    },
  });
});

export const folderQuery = queryField((t) => {
  t.field("folder", {
    type: "Folder",
    args: {
      id: stringArg(),
      worldId: stringArg(),
    },
    resolve: async (parent, { id, worldId }, context) => {
      if (id) {
        let authRes = await userCanAccessFolder(id, "READ", context);
        if (authRes !== true) return null;
        return context.prisma.folder.findUnique({
          where: { id },
        });
      } else if (worldId) {
        let folder = await context.prisma.folder.findFirst({
          where: { parentFolderId: null, name: "root", worldId },
        });
        console.log(folder);
        if (!folder) return null;
        let authRes = await userCanAccessFolder(folder.id, "READ", context);
        if (authRes !== true) return null;
        return folder;
      }
      return null;
    },
  });

  t.nonNull.list.nonNull.field("folders", {
    type: "Folder",
    args: {
      worldId: nonNull(stringArg()),
    },
    resolve(parent, { worldId }, context) {
      return context.prisma.folder.findMany({ where: { worldId } });
    },
  });
});
