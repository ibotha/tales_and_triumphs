import {
  enumType,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import { userHasAccessLevelOnObject } from "../Auth/worldAuth";
import { eObjectPermission, eObjectTypes, eSectionTypes } from "../types";
import { recalculateSectionPriorities } from "../Util/sections";
import { generateSelection } from "../Util/select";

export const SectionType = enumType({
  name: "SectionType",
  members: eSectionTypes,
});

export const DocumentSection = objectType({
  name: "DocumentSection",
  definition(t) {
    t.nonNull.id("id");
    t.field("type", { type: "SectionType" });
    t.string("name");
    t.field("textSection", { type: "TextSection" });
    t.nonNull.field("objectAccessControl", { type: "ObjectAccessControl" });
    t.nonNull.field("document", { type: "Document" });
  },
});

export const DocumentSectionMutation = mutationField((t) => {
  t.field("deleteDocumentSection", {
    type: "DocumentSection",
    args: {
      sectionId: nonNull(stringArg()),
    },
    resolve: async (parent, { sectionId }, context, info) => {
      if (
        !(await userHasAccessLevelOnObject(
          sectionId,
          eObjectTypes.Section,
          eObjectPermission.WRITE,
          context
        ))
      )
        throw new Error("Insufficient Permissions");
      const select = generateSelection<"DocumentSection">(info, undefined, {
        documentId: true,
      });
      const section = await context.prisma.documentSection.delete({
        where: { id: sectionId },
        ...select,
      });
      if (section) {
        await recalculateSectionPriorities(section.documentId, context);
      }
      return section;
    },
  });

  t.field("updateDocumentSection", {
    type: "DocumentSection",
    args: {
      id: nonNull(stringArg()),
      name: nonNull(stringArg()),
    },
    resolve: async (parent, { id, name }, context, info) => {
      const select = generateSelection<"DocumentSection">(info);
      if (
        !(await userHasAccessLevelOnObject(
          id,
          eObjectTypes.Section,
          eObjectPermission.WRITE,
          context
        ))
      )
        throw new Error("Insufficient Permissions");
      return context.prisma.documentSection.update({
        where: { id: id },
        data: {
          name,
        },
        ...select,
      });
    },
  });
});

export const DocumentSectionQuery = queryField((t) => {
  t.field("documentSection", {
    type: "DocumentSection",
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (parent, { id }, context, info) => {
      if (
        !(await userHasAccessLevelOnObject(
          id,
          eObjectTypes.Section,
          eObjectPermission.READ,
          context
        ))
      )
        throw new Error("Insufficient Permissions");
      const select = generateSelection<"DocumentSection">(info);
      return context.prisma.documentSection.findUnique({
        where: { id: id },
        ...select,
      });
    },
  });
});
