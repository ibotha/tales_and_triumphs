import { Prisma } from "@prisma/client";
import { nonNull, objectType, queryField, stringArg } from "nexus";
import { roleLevels, userHasWorldRole } from "../Auth/worldAuth";
import { generateSelect } from "../Util/select";

export const DocumentCategory = objectType({
  name: "DocumentCategory",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.id("worldId");
    t.id("creatorId");
    t.nonNull.string("name");
    t.nonNull.string("colour");
    t.nonNull.field("world", { type: "World" });
    t.nonNull.list.nonNull.field("documents", { type: "Document" });
    t.field("creator", { type: "User" });
  },
});

export const documentCategoryQuery = queryField((t) => {
  t.nonNull.list.nonNull.field("documentCategories", {
    type: "DocumentCategory",
    args: {
      worldId: nonNull(stringArg()),
    },
    async resolve(parent, { worldId }, context, info) {
      let select = generateSelect<Prisma.DocumentCategorySelect>()(info, {
        id: true,
      });
      if (!(await userHasWorldRole(worldId, roleLevels.USER, context)))
        throw Error("You are not allowed to access this world.");
      let ret = await context.prisma.documentCategory.findMany({
        where: { worldId },
        ...select,
      });
      return ret;
    },
  });
});
