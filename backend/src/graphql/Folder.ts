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
  getUserAccessLevelOnObjectAccessControl,
  userHasAccessLevelOnObject,
  userHasWorldRole,
} from "../Auth/worldAuth";
import { eObjectPermission, eObjectTypes, eWorldRole } from "../types";
import { generateSelection } from "../Util/select";
import { generateErrorType } from "./Errors";

export const FolderWrapper = generateErrorType({
  name: "FolderWrapper",
  wrappedType: "Folder",
});

/* -------------------------------------
Object Declaration
------------------------------------- */
export const Folder = objectType({
  name: "Folder",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.nonNull.string("colour");
    t.string("worldId");
    t.nonNull.field("objectAccessControl", {
      type: "ObjectAccessControl",
    });
    t.nonNull.field("world", { type: "World" });
    t.nonNull.list.nonNull.field("documents", {
      type: "Document",
      resolve: async (parent, _, context) => {
        return parent.documents
          ? parent.documents.filter((d) =>
              userHasAccessLevelOnObject(
                d.id,
                eObjectTypes.Document,
                eObjectPermission.READ,
                context
              )
            )
          : [];
      },
    });
    t.string("parentFolderId");
    t.field("parentFolder", {
      type: "Folder",
    });
    t.nonNull.list.nonNull.field("subfolders", {
      type: "Folder",
      resolve: async (parent, _, context) => {
        return parent.subfolders
          ? parent.subfolders.filter((d) =>
              userHasAccessLevelOnObject(
                d.id,
                eObjectTypes.Folder,
                eObjectPermission.READ,
                context
              )
            )
          : [];
      },
    });
    t.field("creator", {
      type: "User",
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
    async resolve(
      parent,
      { name, colour, worldId, parentFolderId },
      context,
      info
    ) {
      const parentFolder = await context.prisma.folder.findUnique({
        where: { id: parentFolderId },
        include: { objectAccessControl: true },
      });
      if (!parentFolder) throw new Error("No parent folder");
      if (
        (await getUserAccessLevelOnObjectAccessControl(
          parentFolder.objectAccessControlId,
          context
        )) > eObjectPermission.WRITE
      ) {
        throw Error("You do not have the right permissions!");
      }
      let role = await context.prisma.worldRole.findUnique({
        where: {
          userId_worldId: { userId: context.req.session.user!.id, worldId },
        },
      });
      let select = generateSelection<"Folder">(info, "data");
      let folder = await context.prisma.folder.create({
        data: {
          name,
          colour: colour || undefined,
          parentFolder: { connect: { id: parentFolderId } },
          world: { connect: { id: worldId } },
          objectAccessControl: {
            create: {
              type: eObjectTypes.Folder,
              creator: { connect: { id: role?.userId } },
              world: { connect: { id: worldId } },
              edit: {
                connect: {
                  id: role?.userId,
                },
              },
            },
          },
        },
        ...select,
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
    resolve: async (
      parent,
      { id, colour, name, parentFolderId },
      context,
      info
    ) => {
      let select = generateSelection<"Folder">(info);

      const checkFolder = await context.prisma.folder.findUnique({
        where: { id: id },
        include: { objectAccessControl: true },
      });
      if (!checkFolder) throw new Error("No parent folder");
      if (
        (await getUserAccessLevelOnObjectAccessControl(
          checkFolder.objectAccessControlId,
          context
        )) > eObjectPermission.WRITE
      ) {
        throw Error("You do not have the right permissions!");
      }

      let folder = await context.prisma.folder.findUnique({ where: { id } });
      if (!folder?.parentFolderId) return null;

      let ret = await context.prisma.folder.update({
        where: { id },
        data: {
          colour: colour || undefined,
          name: name || undefined,
          parentFolder: parentFolderId
            ? { connect: { id: parentFolderId } }
            : undefined,
        },
        ...select,
      });
      return ret;
    },
  });

  t.field("deleteFolder", {
    type: "Folder",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (parent, { id }, context, info) => {
      let select = generateSelection<"Folder">(info);

      const checkFolder = await context.prisma.folder.findUnique({
        where: { id: id },
        include: { objectAccessControl: true },
      });
      if (!checkFolder) throw new Error("No parent folder");
      if (
        (await getUserAccessLevelOnObjectAccessControl(
          checkFolder.objectAccessControlId,
          context
        )) > eObjectPermission.WRITE
      ) {
        throw Error("You do not have the right permissions!");
      }
      let folder = await context.prisma.folder.findUnique({
        where: { id },
      });
      if (folder?.parentFolderId === null) return null;

      let ret = await context.prisma.folder.delete({
        where: { id },
        ...select,
      });
      return ret;
    },
  });
});

export const folderQuery = queryField((t) => {
  t.field("folder", {
    type: "Folder",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (parent, { id }, context, info) => {
      let select = generateSelection<"Folder">(info);
      const checkFolder = await context.prisma.folder.findUnique({
        where: { id: id },
        include: { objectAccessControl: true },
      });
      if (!checkFolder) throw new Error("No parent folder");
      if (
        (await getUserAccessLevelOnObjectAccessControl(
          checkFolder.objectAccessControlId,
          context
        )) > eObjectPermission.READ
      ) {
        throw Error("You do not have the right permissions!");
      }
      return context.prisma.folder.findUnique({
        where: { id },
        ...select,
      });
    },
  });

  t.nonNull.list.nonNull.field("folders", {
    type: "Folder",
    args: {
      worldId: nonNull(stringArg()),
    },
    resolve(parent, { worldId }, context, info) {
      let select = generateSelection<"Folder">(info);
      return context.prisma.folder.findMany({ where: { worldId }, ...select });
    },
  });
});
