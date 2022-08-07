import {
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import {
  getUserAccessLevelOnObjectAccessControl,
  userHasWorldRole,
} from "../Auth/worldAuth";
import { eObjectPermission, eObjectTypes, eWorldRole } from "../types";
import { generateSelection } from "../Util/select";

export const DocumentTemplate = objectType({
  name: "DocumentTemplate",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.nonNull.string("content");
    t.nonNull.field("objectAccessControl", {
      type: "ObjectAccessControl",
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
      const select = generateSelection<"Template">(info);
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
      return context.prisma.documentTemplate.create({
        data: {
          name,
          content,
          world: { connect: { id: worldId } },
          objectAccessControl: {
            create: {
              type: eObjectTypes.DocumentTemplate,
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
      const select = generateSelection<"Template">(info);
      const template = await context.prisma.documentTemplate.findUnique({
        where: { id: id },
        include: { objectAccessControl: true },
      });
      if (!template) throw new Error("No template found!");
      let authRes =
        (await getUserAccessLevelOnObjectAccessControl(
          template.objectAccessControlId,
          context
        )) === eObjectPermission.WRITE;
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
      const template = await context.prisma.documentTemplate.findUnique({
        where: { id: id },
        include: { objectAccessControl: true },
      });
      if (!template) throw new Error("No template found!");
      let authRes =
        (await getUserAccessLevelOnObjectAccessControl(
          template.objectAccessControlId,
          context
        )) === eObjectPermission.WRITE;
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
      const select = generateSelection<"Template">(info);
      const template = await context.prisma.documentTemplate.findUnique({
        where: { id: id },
        include: { objectAccessControl: true },
      });
      if (!template) throw new Error("No template found!");
      if (
        (await getUserAccessLevelOnObjectAccessControl(
          template.objectAccessControlId,
          context
        )) > eObjectPermission.READ
      )
        return null;
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
      const select = generateSelection<"Template">(info);
      return context.prisma.documentTemplate.findMany({
        where: { worldId },
        ...select,
      });
    },
  });
});
