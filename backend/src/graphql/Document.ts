import {
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
      resolve: async (parent, _, context) => {
        let res = await context.prisma.documentCategory.findFirst({
          where: { documents: { some: { id: parent.id } } },
        });
        return res;
      },
    });
    t.nonNull.field("world", {
      type: "World",
      resolve: async (parent, _, context) => {
        let res = await context.prisma.document
          .findUnique({
            where: { id: parent.id! },
          })
          .world();
        return res!;
      },
    });
    t.field("folder", {
      type: "Folder",
      resolve(parent, _, context) {
        return context.prisma.document
          .findUnique({
            where: { id: parent.id },
          })
          .parentFolder();
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
      context
    ) {
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
    },
    resolve: async (
      parent,
      { id, content, name, parentFolderId, categoryId },
      context
    ) => {
      let authRes = await userCanAccessDocument(id, "WRITE", context);
      if (authRes !== true) return null;
      let ret = await context.prisma.document.update({
        where: { id },
        data: {
          content: content || undefined,
          name: name || undefined,
          parentFolderId: parentFolderId || undefined,
          categoryId: categoryId || undefined,
        },
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
    resolve: async (parent, { id }, context) => {
      let authRes = await userCanAccessDocument(id, "READ", context);
      if (authRes !== true) return null;
      return context.prisma.document.findUnique({ where: { id } });
    },
  });

  t.nonNull.list.nonNull.field("documents", {
    type: "Document",
    args: {
      worldId: nonNull(stringArg()),
    },
    resolve(parent, { worldId }, context) {
      return context.prisma.document.findMany({ where: { worldId } });
    },
  });
});
