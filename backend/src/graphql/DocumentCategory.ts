import { objectType } from "nexus";

export const DocumentCategory = objectType({
  name: "DocumentCategory",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.nonNull.string("colour");
    t.nonNull.field("world", {
      type: "World",
    });
    t.nonNull.list.nonNull.field("documents", {
      type: "Document",
    });
    t.field("creator", { type: "User" });
  },
});
