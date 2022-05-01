import { Prisma } from "@prisma/client";
import {
  arg,
  enumType,
  intArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import {
  userHasAccessLevelOnObject,
  userHasWorldRole,
} from "../Auth/worldAuth";
import { eObjectPermission, eObjectTypes, eWorldRole } from "../types";
import { reOrderSection } from "../Util/sections";
import { generateSelection } from "../Util/select";
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
    t.nonNull.field("objectAccessControl", {
      type: "ObjectAccessControl",
    });
    t.field("category", {
      type: "DocumentCategory",
    });
    t.nonNull.field("world", {
      type: "World",
      resolve: (parent) => {
        return parent.world!;
      },
    });
    t.field("parentFolder", {
      type: "Folder",
    });
    t.field("creator", {
      type: "User",
    });
    t.nonNull.list.nonNull.field("sections", {
      type: "DocumentSection",
      resolve: async (parent, _, context) => {
        const ret = parent.sections
          ? parent.sections
              .filter((d) =>
                userHasAccessLevelOnObject(
                  d.id,
                  eObjectTypes.Section,
                  eObjectPermission.READ,
                  context
                )
              )
              .sort((a, b) => a.priority - b.priority)
          : [];
        return ret;
      },
    });
  },
});

export const documentMutation = mutationField((t) => {
  t.field("createDocument", {
    type: "DocumentWrapper",
    args: {
      name: nonNull(stringArg()),
      parentFolderId: stringArg(),
      categoryId: stringArg(),
      worldId: nonNull(stringArg()),
    },
    async resolve(
      parent,
      { name, worldId, parentFolderId, categoryId },
      context,
      info
    ) {
      let select = generateSelection<"Document">(info, "data");

      if (
        !(await userHasWorldRole(worldId, Math.min(eWorldRole.USER), context))
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
            parentFolder: parentFolderId
              ? { connect: { id: parentFolderId } }
              : undefined,
            world: { connect: { id: worldId } },
            category: categoryId ? { connect: { id: categoryId } } : undefined,
            objectAccessControl: {
              create: {
                type: eObjectTypes.Document,
                world: { connect: { id: worldId } },
                creator: {
                  connect: {
                    id: role?.userId,
                  },
                },
                edit: {
                  connect: {
                    id: role?.userId,
                  },
                },
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
      parentFolderId: stringArg(),
      categoryId: stringArg(),
      name: stringArg(),
    },
    resolve: async (
      parent,
      { id, name, parentFolderId, categoryId },
      context,
      info
    ) => {
      let authRes = await userHasAccessLevelOnObject(
        id,
        eObjectTypes.Document,
        eObjectPermission.WRITE,
        context
      );
      let select = generateSelection<"Document">(info);
      if (authRes !== true) return null;

      let ret = await context.prisma.document.update({
        where: { id },
        data: {
          name: name || undefined,
          parentFolderId: parentFolderId || undefined,
          categoryId: categoryId || undefined,
        },
        ...select,
      });
      return ret;
    },
  });

  t.field("deleteDocument", {
    type: "Document",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (parent, { id }, context, info) => {
      if (
        !(await userHasAccessLevelOnObject(
          id,
          eObjectTypes.Document,
          eObjectPermission.WRITE,
          context
        ))
      )
        return null;
      let select = generateSelection<"Document">(info);
      return context.prisma.document.delete({
        where: { id },
        ...select,
      });
    },
  });

  t.field("reOrderSection", {
    type: "DocumentSection",
    args: {
      sectionId: nonNull(stringArg()),
      index: nonNull(intArg()),
    },
    resolve: async (parent, { sectionId, index }, context, info) => {
      await reOrderSection(sectionId, index, context);
      let select = generateSelection<"DocumentSection">(info);
      return context.prisma.documentSection.findUnique({
        where: { id: sectionId },
        ...select,
      });
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
      if (
        !(await userHasAccessLevelOnObject(
          id,
          eObjectTypes.Document,
          eObjectPermission.READ,
          context
        ))
      )
        throw new Error("InsufficientPermissions");
      let select = generateSelection<"Document">(info);
      return context.prisma.document.findUnique({ where: { id }, ...select });
    },
  });

  t.nonNull.list.nonNull.field("documents", {
    type: "Document",
    args: {
      worldId: nonNull(stringArg()),
    },
    resolve(parent, { worldId }, context, info) {
      let select = generateSelection<"Document">(info);
      return context.prisma.document.findMany({
        where: { worldId },
        ...select,
      });
    },
  });
});
