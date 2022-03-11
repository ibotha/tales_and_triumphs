<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="data.me !== null">{{ $router.push("/home") }}</div>
  <div v-else class="container">
    <header>
      <nav>
        <h1 style="padding-bottom: 1em">
          Welcome <br />to Tales &amp; Triumphs
        </h1>
        <router-link class="btn" :to="'login'">login</router-link>
        <router-link class="btn" :to="'register'">register</router-link>
      </nav>
    </header>
    <hr />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useQuery, gql } from "@urql/vue";
import { RouterView } from "vue-router";

const { fetching: fetching, data: data } = useQuery({
  query: gql`
    {
      me {
        id
        username
      }
    }
  `,
});
</script>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-columns: 1fr 1px 2fr;
  justify-items: center;
  gap: 2em;
  height: 100vh;

  @media (max-width: 800px) {
    grid-template-columns: none;
  }
}

header {
  display: flex;

  text-align: center;
  flex-flow: column;
  justify-content: space-around;
}

main {
  display: flex;

  text-align: center;
  flex-flow: column;
  justify-content: space-around;
}
</style>
