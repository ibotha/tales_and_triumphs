<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">Oof</div>
  <div v-else-if="data.document === null">No Document here</div>
  <div v-else @click="navigate" class="document hover-bubble">
    {{ data.document.name }}
    <hr style="margin-bottom: 1em; margin-top: 1em" />
    <hr style="margin-bottom: 1em" />
    <hr style="margin-bottom: 1em" />
  </div>
</template>

<script setup lang="ts">
import { useQuery, gql } from "@urql/vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps(["worldId", "documentId"]);

const navigate = () => {
  router.push(`/world/${props.worldId}/document/${props.documentId}`);
};

const { fetching, data, error } = useQuery({
  query: gql`
    query DocumentIcon($id: String!) {
      document(id: $id) {
        id
        name
      }
    }
  `,
  variables: {
    id: props.documentId,
  },
});
</script>

<style scoped>
.document {
  width: 6em;
  height: 8em;
  padding: 0.5em;
  margin: auto;
  background-color: var(--color-background-mute);
  box-shadow: -2px 2px var(--color-background-soft);
  cursor: pointer;
}
</style>
