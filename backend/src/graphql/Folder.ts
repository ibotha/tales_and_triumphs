import { objectType } from "nexus";

export const Folder = objectType({
  name: "Folder",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.id("worldId");
    t.id("creatorId");
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.nonNull.string("colour");
    t.nonNull.field("world", {
      type: "World",
      async resolve(parent, _, context) {
        let res = await context.prisma.world.findUnique({
          where: { id: parent.worldId! },
        });
        return res!;
      },
    });
    t.nonNull.list.nonNull.field("documents", {
      type: "Document",
      async resolve(parent, _, context) {
        let res = await context.prisma.document.findMany({
          where: { folderId: parent.id },
        });
        return res;
      },
    });
    t.field("parentFolder", { type: "Folder" });
    t.nonNull.list.nonNull.field("subfolders", {
      type: "Folder",
      async resolve(parent, _, context) {
        let res = await context.prisma.folder.findMany({
          where: { parentId: parent.id },
        });
        return res!;
      },
    });
    t.field("creator", {
      type: "User",
      resolve(parent, _, context) {
        return context.prisma.user.findUnique({
          where: { id: parent.creatorId! },
        });
      },
    });
  },
});
