import {
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import {
  roleLevels,
  userCanAccessDocumentTemplate,
  userHasWorldRole,
} from "../Auth/worldAuth";

export const DocumentTemplate = objectType({
  name: "DocumentTemplate",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.nonNull.string("content");
  },
});

export const documentTemplateMutation = mutationField((t) => {
  t.field("createDocumentTemplate", {
    type: "DocumentTemplate",
    args: {
      name: nonNull(stringArg()),
      content: nonNull(stringArg()),
      worldId: nonNull(stringArg()),
    },
    async resolve(parent, { name, content, worldId }, context) {
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
      return context.prisma.documentTemplate.create({
        data: {
          name,
          content,
          accessLevel: 0,
          worldId,
          creatorId: role?.userId,
          edit: {
            connect: {
              id: role?.userId,
            },
          },
        },
      });
    },
  });

  t.field("updateDocumentTemplate", {
    type: "DocumentTemplate",
    args: {
      id: nonNull(stringArg()),
      content: stringArg(),
      name: stringArg(),
    },
    resolve: async (parent, { id, content, name }, context) => {
      let authRes = await userCanAccessDocumentTemplate(id, "WRITE", context);
      if (authRes !== true) return null;
      let ret = await context.prisma.documentTemplate.update({
        where: { id },
        data: { content: content || undefined, name: name || undefined },
      });
      return ret;
    },
  });

  t.field("deleteDocumentTemplate", {
    type: "Boolean",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (parent, { id }, context) => {
      let authRes = await userCanAccessDocumentTemplate(id, "WRITE", context);
      if (authRes !== true) return null;
      let ret = await context.prisma.documentTemplate.delete({
        where: { id },
      });
      return !!ret;
    },
  });
});

export const documentTemplateQuery = queryField((t) => {
  t.field("documentTemplate", {
    type: "DocumentTemplate",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (parent, { id }, context) => {
      let authRes = await userCanAccessDocumentTemplate(id, "READ", context);
      if (authRes !== true) return null;
      return context.prisma.documentTemplate.findUnique({ where: { id } });
    },
  });

  t.nonNull.list.nonNull.field("documentTemplates", {
    type: "DocumentTemplate",
    args: {
      worldId: nonNull(stringArg()),
    },
    resolve(parent, { worldId }, context) {
      return context.prisma.documentTemplate.findMany({ where: { worldId } });
    },
  });
});
