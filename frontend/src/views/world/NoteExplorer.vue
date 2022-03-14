<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">Oof</div>
  <div v-else-if="data.folder === null">No Folder here</div>
  <div v-else>
    <div style="display: flex; gap: 1em; justify-content: space-evenly">
      <router-link class="btn" :to="`folder/${data.folder.id}/createFolder`"
        >New Folder</router-link
      >
      <router-link class="btn" :to="`folder/${data.folder.id}/createFolder`"
        >New Document</router-link
      >
    </div>
    <h2>{{ data.folder.name }}</h2>

    <router-link
      v-if="data.folder.parentFolder"
      class="btn"
      :to="`${data.folder.parentFolder.id}`"
      >Up</router-link
    >
    <div v-for="f in data.folder.subfolders" :key="f.id">
      <router-link :to="f.id">{{ f.name }}</router-link>
    </div>
    <div v-for="f in data.folder.documents" :key="f.id">
      <router-link :to="f.id">{{ f.name }}</router-link>
    </div>
    <div style="display: none">
      {{ (folderId = $route.params.folderId) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery, gql } from "@urql/vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
let folderId: any = ref(route.params.folderId);
let worldId: any = ref(route.params.worldId);

const { fetching, data, error, executeQuery } = useQuery({
  query: gql`
    query Folder($id: String, $worldId: String) {
      folder(id: $id, worldId: $worldId) {
        id
        name
        parentFolder {
          id
          name
        }
        documents {
          id
          name
        }
        subfolders {
          id
          name
        }
      }
    }
  `,
  variables: {
    worldId: !folderId.value ? worldId : undefined,
    id: folderId,
  },
});

watch(folderId, (e) => {
  console.log(e);
  executeQuery();
});
</script>

<style scoped></style>
