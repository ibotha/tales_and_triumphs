import {
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import {
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
    t.field("parentFolder", {
      type: "Folder",
      resolve: (parent, _, context) => {
        return context.prisma.folder
          .findUnique({ where: { id: parent.id } })
          .parentFolder();
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
    },
    resolve: async (parent, { id, colour, name, parentFolderId }, context) => {
      let authRes = await userCanAccessFolder(id, "WRITE", context);
      if (authRes !== true) return null;
      let ret = await context.prisma.folder.update({
        where: { id },
        data: {
          colour: colour || undefined,
          name: name || undefined,
          parentFolderId: parentFolderId || undefined,
        },
      });
      return ret;
    },
  });

  t.field("deleteFolder", {
    type: "Boolean",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (parent, { id }, context) => {
      let authRes = await userCanAccessFolder(id, "WRITE", context);
      if (authRes !== true) return null;
      let ret = await context.prisma.folder.delete({
        where: { id },
      });
      return !!ret;
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
