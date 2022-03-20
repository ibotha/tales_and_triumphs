import { Prisma } from "@prisma/client";
import {
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import {
  getUserAccessLevelOnDocumentTemplate,
  roleLevels,
  userCanAccessDocumentTemplate,
  userHasWorldRole,
} from "../Auth/worldAuth";
import { generateSelect } from "../Util/select";

export const DocumentTemplate = objectType({
  name: "DocumentTemplate",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.nonNull.string("content");
    t.nonNull.boolean("editable", {
      resolve: async (parent, _, context) => {
        return (
          (await getUserAccessLevelOnDocumentTemplate(parent.id, context)) ===
          "WRITE"
        );
      },
    });
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
    async resolve(parent, { name, content, worldId }, context, info) {
      let select = generateSelect<Prisma.DocumentTemplateSelect>()(info, {
        id: true,
      });
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
          worldId,
          creatorId: role?.userId,
          edit: {
            connect: {
              id: role?.userId,
            },
          },
        },

        ...select,
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
    resolve: async (parent, { id, content, name }, context, info) => {
      let select = generateSelect<Prisma.DocumentTemplateSelect>()(info, {
        id: true,
      });
      let authRes = await userCanAccessDocumentTemplate(id, "WRITE", context);
      if (authRes !== true) return null;
      let ret = await context.prisma.documentTemplate.update({
        where: { id },
        data: { content: content || undefined, name: name || undefined },
        ...select,
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
        select: { id: true },
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
    resolve: async (parent, { id }, context, info) => {
      let select = generateSelect<Prisma.DocumentTemplateSelect>()(info, {
        id: true,
      });
      let authRes = await userCanAccessDocumentTemplate(id, "READ", context);
      if (authRes !== true) return null;
      return context.prisma.documentTemplate.findUnique({
        where: { id },
        ...select,
      });
    },
  });

  t.nonNull.list.nonNull.field("documentTemplates", {
    type: "DocumentTemplate",
    args: {
      worldId: nonNull(stringArg()),
    },
    resolve(parent, { worldId }, context, info) {
      let select = generateSelect<Prisma.DocumentTemplateSelect>()(info, {
        id: true,
      });
      return context.prisma.documentTemplate.findMany({
        where: { worldId },
        ...select,
      });
    },
  });
});
