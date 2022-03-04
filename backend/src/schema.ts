import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from "./graphql"

export const schema = makeSchema({
    types,
    outputs: {
        schema: join(process.cwd(), "generated", "schema.graphql"),
        typegen: join(process.cwd(), "generated", "nexus-typegen.ts"),
    },
    contextType: {
        module: join(process.cwd(), "./src/context.ts"),  // 1
        export: "Context",  // 2
    }
})