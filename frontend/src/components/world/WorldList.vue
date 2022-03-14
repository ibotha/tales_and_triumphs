<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">Oof</div>
  <div v-else>
    <WorldSummaryBanner
      v-for="world in data.myWorlds"
      :key="world.id"
      :uuid="world.id"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuery, gql } from "@urql/vue";
import WorldSummaryBanner from "./WorldSummaryBanner.vue";

const { fetching, data, error } = useQuery({
  query: gql`
    {
      myWorlds {
        id
      }
    }
  `,
});
</script>

<style scoped></style>
