<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">Oof</div>
  <div v-else-if="data.folder === null">No Folder here</div>
  <div v-else @click="navigate" class="folder hover-bubble">
    <h4 class="folder-name">{{ data.folder.name }}</h4>
    <div
      v-if="data.folder.editable"
      class="folder-settings"
      @click.stop="$emit('updateClicked')"
    >
      O
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery, gql } from "@urql/vue";
import { useCssVars } from "vue";
import { useRouter } from "vue-router";
import tinyColor from "tinycolor2";

const router = useRouter();
const props = defineProps(["worldId", "folderId"]);
defineEmits(["updateClicked"]);

const navigate = () => {
  router.push(`/world/${props.worldId}/folder/${props.folderId}`);
};

const { fetching, data, error } = useQuery({
  query: gql`
    query FolderIcon($id: String!) {
      folder(id: $id) {
        id
        name
        colour
        editable
      }
    }
  `,
  variables: {
    id: props.folderId,
  },
});

let expDarken = (c: tinyColor.Instance) => {
  let l = c.getLuminance();
  return c.darken(Math.max(5, l * 50));
};

useCssVars(() => {
  return {
    "folder-colour": data.value ? data.value.folder.colour : "#000",
    "shadow-colour": data.value
      ? `#${expDarken(tinyColor(data.value.folder.colour)).toHex()}`
      : "#000",
    "text-colour": data.value
      ? tinyColor(data.value.folder.colour).getLuminance() > 0.4
        ? "var(--vt-c-text-light-1)"
        : "var(--vt-c-text-dark-1)"
      : "#000",
  };
});
</script>

<style scoped>
.folder {
  width: 8em;
  height: 5em;
  padding: 0.5em;
  border-radius: 0 2em 0 0;
  margin: auto;
  cursor: pointer;
  color: var(--text-colour);
  position: relative;
  background-color: var(--folder-colour);
  box-shadow: 1px -3px var(--shadow-colour);
}

.folder-settings {
  position: absolute;
  bottom: 0;
  left: 0;
  width: fit-content;
  padding: 0.25em 0.5em;
  background-color: var(--shadow-colour);
  background-clip: unset;
}

.folder-settings:hover {
  filter: brightness(0.5);
}
</style>
