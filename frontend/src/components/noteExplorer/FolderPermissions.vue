<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">Oof</div>
  <div v-else class="folder-permissions">
    <div style="display: flex">
      <div>Editors:</div>
      <div class="username-badge-list">
        <div
          class="username-badge"
          v-for="u in data.folder.editors"
          :key="u.id"
        >
          {{ u.username }}
        </div>
      </div>
      <div
        v-if="data.folder.editable"
        class="btn"
        style="margin-left: auto; padding: 0 0.5em"
      >
        +
      </div>
    </div>
    <div style="display: flex">
      <div>Readers:</div>
      <div class="username-badge-list">
        <div
          class="username-badge"
          v-for="u in data.folder.readers"
          :key="u.id"
        >
          {{ u.username }}
        </div>
      </div>
      <div
        v-if="data.folder.editable"
        class="btn"
        style="margin-left: auto; padding: 0 0.5em"
      >
        +
      </div>
    </div>
    Read: {{ data.folder.readAccessLevel }} <br />
    Write: {{ data.folder.writeAccessLevel }} <br />
  </div>
</template>

<script setup lang="ts">
import { useQuery, gql } from "@urql/vue";
import { useCssVars } from "vue";

const props = defineProps({
  folderId: String,
});

const { fetching, data, error } = useQuery({
  query: gql`
    query FolderPermissions($id: String) {
      folder(id: $id) {
        id
        editable
        editors {
          id
          username
        }
        readers {
          id
          username
        }
        readAccessLevel
        writeAccessLevel
      }
    }
  `,
  variables: {
    id: props.folderId,
  },
});

useCssVars(() => ({
  "bg-col": data.value?.folder?.colour,
}));
</script>

<style scoped>
.folder-permissions {
  padding: 2em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  box-shadow: 2px 2px 15px inset rgba(49, 49, 49, 0.1);
  background-color: var(--bg-col);
  filter: saturate(0.5);
  background-color: var(--color-background-mute);
  text-align: start;
}

.username-badge {
  padding: 0 0.5em;
  background-color: var(--color-background-soft);
}

.username-badge-list {
  margin-left: 1em;
  display: flex;
  gap: 1em;
}
</style>
