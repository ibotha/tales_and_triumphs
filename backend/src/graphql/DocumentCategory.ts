import { nonNull, objectType, queryField, stringArg } from "nexus";
import { roleLevels, userHasWorldRole } from "../Auth/worldAuth";

export const DocumentCategory = objectType({
  name: "DocumentCategory",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.id("worldId");
    t.id("creatorId");
    t.nonNull.string("name");
    t.nonNull.string("colour");
    t.nonNull.field("world", {
      type: "World",
      async resolve(parent, _, context) {
        let res = await context.prisma.world.findUnique({
          where: { id: parent.worldId },
        });
        return res!;
      },
    });
    t.nonNull.list.nonNull.field("documents", {
      type: "Document",
      async resolve(parent, _, context) {
        let res = await context.prisma.document.findMany({
          where: { categoryId: parent.id },
        });
        return res;
      },
    });
    t.field("creator", {
      type: "User",
      resolve(parent, _, context) {
        if (!parent.creatorId) return null;
        return context.prisma.user.findUnique({
          where: { id: parent.creatorId },
        });
      },
    });
  },
});

export const documentCategoryQuery = queryField((t) => {
  t.nonNull.list.nonNull.field("documentCategories", {
    type: "DocumentCategory",
    args: {
      worldId: nonNull(stringArg()),
    },
    async resolve(parent, { worldId }, context) {
      if (!(await userHasWorldRole(worldId, roleLevels.USER, context)))
        throw Error("You are not allowed to access this world.");
      let ret = await context.prisma.documentCategory.findMany({
        where: { worldId },
      });
      return ret;
    },
  });
});
