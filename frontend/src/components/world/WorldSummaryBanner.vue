<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">Oof</div>
  <div v-else>
    <router-link :to="'/world/' + uuid"> {{ data.world.name }} </router-link>
  </div>
</template>

<script setup lang="ts">
import { useQuery, gql } from "@urql/vue";

const props = defineProps(["uuid"]);
const { fetching, data, error } = useQuery({
  query: gql`
    query World($id: String!) {
      world(id: $id) {
        id
        name
      }
    }
  `,
  variables: {
    id: props.uuid,
  },
});
</script>

<style scoped></style>
