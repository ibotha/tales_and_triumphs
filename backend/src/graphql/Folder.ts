import { objectType } from "nexus";

export const Folder = objectType({
  name: "Folder",
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
    t.field("parentFolder", { type: "Folder" });
    t.nonNull.list.nonNull.field("subfolders", { type: "Folder" });
    t.field("creator", { type: "User" });
    t.field("creator", { type: "User" });
  },
});
