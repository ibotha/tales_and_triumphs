<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">Oof</div>
  <div v-else>
    <div v-for="u in data.world.users" :key="u.id">
      {{ u.username }} {{ u.role.level }}
    </div>
    <router-link class="btn" :to="'/world/' + $route.params.id + '/invite'"
      >Add</router-link
    >
  </div>
</template>

<script setup lang="ts">
import { useQuery, gql } from "@urql/vue";
import { useRoute } from "vue-router";

const route = useRoute();

const { fetching, data, error } = useQuery({
  query: gql`
    query World($id: String!) {
      world(id: $id) {
        id
        name
        users {
          id
          username
          role(worldId: $id) {
            id
            level
          }
        }
      }
    }
  `,
  variables: {
    id: route.params.worldId,
  },
});
</script>

<style scoped></style>
