require('dotenv').config();
import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import { schema } from './schema';
import { context } from "./context";

console.log(process.env)
const usePlayground = process.env.USE_PLAYGROUND

export const server = new ApolloServer({
    schema: schema,
    plugins: usePlayground ? [ApolloServerPluginLandingPageGraphQLPlayground()] : [],
    context
});

const port = 4000;

server.listen({ port }).then(({ url }) => {
    console.log("Apollo server hosted on (" + url + ")");
})