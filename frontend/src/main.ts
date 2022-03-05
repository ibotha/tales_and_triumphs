import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import urql, { Client, fetchExchange, dedupExchange } from "@urql/vue";
import { cacheExchange } from "@urql/exchange-graphcache";

const client = new Client({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout(_result, args, cache) {
            cache.invalidate("Query", "me");
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
