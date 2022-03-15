<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">Oof</div>
  <div @click="$router.push('/world/' + uuid)" v-else class="summary-banner">
    <h3>{{ data.world.name }}</h3>
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

<style scoped>
.summary-banner {
  width: 100%;
  box-shadow: -2px 2px var(--color-background-mute);
  background-color: var(--color-background-soft);
  cursor: pointer;
  padding: 2em;
}
</style>
