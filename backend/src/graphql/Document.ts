import { objectType } from "nexus";

export const Document = objectType({
  name: "Document",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.id("worldId");
    t.id("categoryId");
    t.id("folderId");
    t.id("creatorId");
    t.nonNull.list.nonNull.field("mentions", {
      type: "Document",
      resolve(parent, _, context) {
        return context.prisma.document
          .findUnique({
            where: { id: parent.id! },
          })
          .mentions();
      },
    });
    t.nonNull.list.nonNull.field("mentionedIn", {
      type: "Document",
      resolve(parent, _, context) {
        return context.prisma.document
          .findUnique({
            where: { id: parent.id! },
          })
          .mentionedIn();
      },
    });
    t.nonNull.string("name");
    t.int("accessLevel");
    t.nonNull.string("contents");
    t.field("category", {
      type: "DocumentCategory",
      resolve: async (parent, _, context) => {
        let res = await context.prisma.document
          .findUnique({
            where: { id: parent.id! },
          })
          .category();
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
            where: { id: parent.id! },
          })
          .folder();
      },
    });
    t.field("creator", {
      type: "User",
      resolve(parent, _, context) {
        return context.prisma.document
          .findUnique({
            where: { id: parent.id! },
          })
          .creator();
      },
    });
  },
});
