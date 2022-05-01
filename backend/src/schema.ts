import { makeSchema, plugin } from "nexus";
import { join } from "path";
import * as types from "./graphql";
import * as path from "path";
import { PrismaSelect } from "@paljs/plugins";
import { getNexusNamedType } from "nexus/dist/utils";
import { NexusPlugin } from "nexus/dist/plugin";
export const graphQLTypeMap: any = {};
export const schema = makeSchema({
  types,
  plugins: [
    new NexusPlugin({
      name: "TypeMapGenerator",
      onAddOutputField(f) {
        if (!(f.parentType in graphQLTypeMap))
          graphQLTypeMap[f.parentType] = {};
        graphQLTypeMap[f.parentType][f.name] = f.type;
        return f;
      },
    }),
  ],
  sourceTypes: {
    modules: [
      {
        module: path.join(__dirname, "db.ts"),
        alias: "db",
        typeMatch(type, defaultRegex) {
          return new RegExp(
            `(?:interface|type|class|enum)\\s+(${type.name}Model)\\W`,
            "g"
          );
        },
      },
    ],
  },
  outputs: {
    schema: join(process.cwd(), "generated", "schema.graphql"),
    typegen: join(process.cwd(), "generated", "nexus-typegen.ts"),
  },
  contextType: {
    module: join(process.cwd(), "./src/context.ts"), // 1
    export: "Context", // 2
  },
});
