<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">Oof</div>
  <div v-else>
    <div
      style="
        display: flex;
        flex-direction: column;
        gap: 1em;
        margin-bottom: 1em;
      "
    >
      <div v-for="u in data.world.roles" :key="u.id">
        <span style="font-weight: bold">{{ u.user.username }}</span>
        {{ u.level }}
      </div>
    </div>
    <Invite v-if="data.world.myRole === 'ADMIN'" />
  </div>
</template>

<script setup lang="ts">
import { useQuery, gql } from "@urql/vue";
import { useRoute } from "vue-router";
import Invite from "../../components/world/Invite.vue";

const route = useRoute();

const { fetching, data, error } = useQuery({
  query: gql`
    query World($id: String!) {
      world(id: $id) {
        id
        myRole
        roles {
          id
          user {
            id
            username
          }
          level
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
