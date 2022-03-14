import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import urql, { Client, fetchExchange, dedupExchange } from "@urql/vue";
import { cacheExchange } from "@urql/exchange-graphcache";

const client = new Client({
  url: "/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout(_result, args, cache) {
            cache.invalidate("Query");
            cache.invalidate("Mutation");
            cache.invalidate("Query", "me");
          },
          login(
            _result: {
              login: { fieldErrors: { [key: string]: string }[] | null };
            },
            args,
            cache
          ) {
            if (!_result.login.fieldErrors) {
              cache.invalidate("Query", "me");
            }
          },
          assignWorldRole(result, args, cache) {
            cache.invalidate("Query", "world", { id: args.worldId });
          },
        },
      },
    }),
    fetchExchange,
  ],
});

const app = createApp(App);

app.use(urql, client);

app.use(router);

app.mount("#app");
