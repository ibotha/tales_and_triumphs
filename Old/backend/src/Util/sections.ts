import { userHasAccessLevelOnObject } from "../Auth/worldAuth";
import { Context } from "../context";
import { eObjectPermission, eObjectTypes, eSectionTypes } from "../types";

export const createSection = async (
  documentID: string,
  name: string,
  context: Context
) => {
  if (
    !(await userHasAccessLevelOnObject(
      documentID,
      eObjectTypes.Document,
      eObjectPermission.WRITE,
      context
    ))
  )
    throw new Error("Insufficient Permissions");
  const document = await context.prisma.document.findUnique({
    where: { id: documentID },
    select: { _count: { select: { sections: true } }, worldId: true },
  });
  if (!document) throw new Error("Document not found.");
  return context.prisma.documentSection.create({
    data: {
      name,
      priority: document._count.sections,
      document: { connect: { id: documentID } },
      objectAccessControl: {
        create: {
          type: eObjectTypes.Section,
          creator: { connect: { id: context.req.session.user!.id } },
          world: { connect: { id: document.worldId } },
        },
      },
    },
  });
};

export const recalculateSectionPriorities = async (
  documentId: string,
  context: Context
) => {
  const document = await context.prisma.document.findUnique({
    where: { id: documentId },
    select: { sections: { orderBy: { priority: "asc" } } },
  });
  if (!document) throw Error("Document not found.");
  await context.prisma.$transaction(
    document.sections.map((s, i) => {
      return context.prisma.documentSection.update({
        where: { id: s.id },
        data: { priority: i },
      });
    })
  );
};

export const reOrderSection = async (
  documentSectionId: string,
  index: number,
  context: Context
) => {
  const documentSection = await context.prisma.documentSection.findUnique({
    where: { id: documentSectionId },
    select: {
      document: { select: { sections: { orderBy: { priority: "asc" } } } },
      id: true,
      priority: true,
    },
  });
  if (!documentSection) throw Error("DocumentSection not found.");
  index = Math.min(
    documentSection.document.sections.length - 1,
    Math.max(0, index)
  );
  const sections = documentSection.document.sections.map((s) => {
    if (s.id === documentSection.id) s.priority = index;
    else if (s.priority >= index && s.priority < documentSection.priority)
      s.priority++;
    else if (s.priority <= index && s.priority > documentSection.priority)
      s.priority--;
    return s;
  });
  await context.prisma.$transaction(
    sections.map((s, i) => {
      return context.prisma.documentSection.update({
        where: { id: s.id },
        data: { priority: s.priority },
      });
    })
  );
};
