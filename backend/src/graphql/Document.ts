import { objectType } from "nexus";

export const Document = objectType({
  name: "Document",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.list.nonNull.field("mentions", { type: "Document" });
    t.nonNull.list.nonNull.field("mentionedIn", { type: "Document" });
    t.nonNull.string("name");
    t.int("accessLevel");
    t.nonNull.string("contents");
    t.field("category", { type: "DocumentCategory" });
    t.nonNull.field("world", { type: "World" });
    t.field("folder", { type: "Folder" });
    t.field("creator", { type: "User" });
  },
});
