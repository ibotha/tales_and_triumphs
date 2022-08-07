import {
  arg,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import { userHasAccessLevelOnObject } from "../Auth/worldAuth";
import { eObjectPermission, eObjectTypes, eSectionTypes } from "../types";
import { createSection } from "../Util/sections";
import { generateSelection } from "../Util/select";

export const TextSection = objectType({
  name: "TextSection",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.field("section", { type: "DocumentSection" });
    t.nonNull.string("content");
  },
});

export const TextSectionMutation = mutationField((t) => {
  t.field("createTextSection", {
    type: "TextSection",
    args: {
      documentId: nonNull(stringArg()),
    },
    resolve: async (parent, { documentId }, context, info) => {
      const select = generateSelection<"TextSection">(info);
      if (
        !(await userHasAccessLevelOnObject(
          documentId,
          eObjectTypes.Document,
          eObjectPermission.WRITE,
          context
        ))
      )
        throw new Error("Insufficient permissions");
      const section = await createSection(documentId, "Text Section", context);
      return (
        await context.prisma.documentSection.update({
          where: {
            id: section.id,
          },
          data: {
            textSection: {
              create: {},
            },
            type: eSectionTypes.Text,
          },
          select: {
            textSection: select,
          },
        })
      ).textSection;
    },
  });

  t.field("updateTextSection", {
    type: "TextSection",
    args: {
      id: nonNull(stringArg()),
      content: stringArg(),
    },
    resolve: async (parent, { id, content }, context, info) => {
      const textSection = await context.prisma.textSection.findUnique({
        where: { id: id },
        select: { documentSectionId: true },
      });
      if (!textSection) throw new Error("Text Section not found");
      const select = generateSelection<"TextSection">(info);
      if (
        !(await userHasAccessLevelOnObject(
          textSection.documentSectionId,
          eObjectTypes.Section,
          eObjectPermission.WRITE,
          context
        ))
      )
        throw new Error("Insufficient permissions");
      return context.prisma.textSection.update({
        where: { id },
        data: { content: content || undefined },
      });
    },
  });
});

export const TextSectionQuery = queryField((t) => {
  t.field("textSection", {
    type: "TextSection",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (parent, { id }, context, info) => {
      const textSection = await context.prisma.textSection.findUnique({
        where: { id: id },
        select: { documentSectionId: true },
      });
      if (!textSection) throw new Error("Text Section not found");
      if (
        !(await userHasAccessLevelOnObject(
          textSection.documentSectionId,
          eObjectTypes.Section,
          eObjectPermission.READ,
          context
        ))
      )
        throw new Error("Insufficient Permissions");
      const select = generateSelection<"TextSection">(info);
      return context.prisma.textSection.findUnique({
        where: { id: id },
        ...select,
      });
    },
  });
});
