<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">
    404 Folder not found <a @click="goBack" class="btn">go back</a>
  </div>
  <div v-else-if="data.folder === null">No Folder here</div>
  <div v-else>
    <div style="display: flex; gap: 0.5em">
      <router-link
        v-if="data.folder.parentFolder"
        class="btn"
        :to="`${data.folder.parentFolder.id}`"
        ><i class="fa fa-caret-left" aria-hidden="true"></i
      ></router-link>
      <div @click="createFolder = true" class="btn">
        <i class="fa fa-folder" aria-hidden="true"></i>+
      </div>
      <div @click="createDocument = true" class="btn">
        <i class="fa fa-file" aria-hidden="true"></i>+
      </div>
      <div
        style="background-color: brown"
        v-if="data.folder.parentFolder"
        class="btn"
        @click="deleteFolderModal = true"
      >
        Delete
      </div>
    </div>
    <h2
      v-if="data.folder.parentFolder"
      style="
        background-color: var(--color-background-mute);
        margin: 0.5em 0 0 0;
        box-shadow: 2px 1px 5px rgb(0.3, 0.3, 0.3, 0.2);
      "
    >
      {{ data.folder.name }}
    </h2>
    <div v-if="!$route.params.folderId" style="display: none">
      oof
      {{
        $router.push(`/world/${route.params.worldId}/folder/${data.folder.id}`)
      }}
    </div>
    <div class="explorer">
      <FolderIcon
        v-for="(f, i) in data.folder.subfolders"
        :key="f.id"
        :folder-id="f.id"
        :world-id="$route.params.worldId"
        @update-clicked="updateClicked(i)"
      >
      </FolderIcon>

      <DocumentIcon
        v-for="f in data.folder.documents"
        :key="f.id"
        :document-id="f.id"
        :world-id="$route.params.worldId"
      >
      </DocumentIcon>
    </div>
    <FolderPermissions
      :folderId="folderId"
      v-if="data.folder.parentFolder"
    ></FolderPermissions>
    <ModalComponent v-if="createFolder" @close="createFolder = false"
      ><CreateFolder @success="createFolder = false"></CreateFolder
    ></ModalComponent>
    <ModalComponent v-if="updateFolder" @close="updateFolder = null"
      ><UpdateFolder
        :folder="updateFolder"
        @success="updateFolder = null"
      ></UpdateFolder
    ></ModalComponent>
    <ModalComponent v-if="createDocument" @close="createDocument = false"
      ><CreateDocument @success="createDocument = false"></CreateDocument
    ></ModalComponent>
    <ModalComponent v-if="deleteFolderModal" @close="deleteFolderModal = false">
      <ConfirmComponent @no="deleteFolderModal = false" @yes="deleteFolder">
        <h2 style="max-width: 30ch; text-align: center; margin-bottom: 1em">
          Are you sure you want to delete your folder?
        </h2>
      </ConfirmComponent>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import { useQuery, gql, useMutation } from "@urql/vue";
import { computed, ref, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import FolderIcon from "../../components/noteExplorer/FolderIcon.vue";
import DocumentIcon from "../../components/noteExplorer/DocumentIcon.vue";
import ModalComponent from "../../components/structure/ModalComponent.vue";
import CreateFolder from "../../components/noteExplorer/CreateFolder.vue";
import CreateDocument from "../../components/noteExplorer/CreateDocument.vue";
import UpdateFolder from "../../components/noteExplorer/UpdateFolder.vue";
import ConfirmComponent from "../../components/structure/ConfirmComponent.vue";
import FolderPermissions from "../../components/noteExplorer/FolderPermissions.vue";

const route = useRoute();
const router = useRouter();

let folderId = computed(() => {
  return route.params.folderId;
});
let worldId = computed(() => {
  return !folderId.value ? route.params.worldId : undefined;
});
let createFolder = ref(false);
let createDocument = ref(false);
let deleteFolderModal = ref(false);
let updateFolder: Ref<any> = ref(null);

const { fetching, data, error, executeQuery } = useQuery({
  query: gql`
    query Folder($id: String, $worldId: String) {
      folder(id: $id, worldId: $worldId) {
        id
        name
        colour
        editors {
          id
        }
        readers {
          id
        }
        readAccessLevel
        writeAccessLevel
        parentFolder {
          id
        }
        documents {
          id
          name
        }
        subfolders {
          id
          name
          colour
        }
      }
    }
  `,
  variables: {
    worldId: worldId,
    id: folderId,
  },
});

const deleteFolderMutation = useMutation(gql`
  mutation DeleteFolder($id: String!) {
    deleteFolder(id: $id) {
      id
      parentFolder {
        id
      }
    }
  }
`);

const goBack = () => {
  router.push(`/world/${route.params.worldId}/folder`);
  executeQuery({
    worldId: !route.params.folderId ? route.params.worldId : undefined,
    id: route.params.folderId,
  });
};

let deleteFolder = () => {
  deleteFolderMutation
    .executeMutation({ id: route.params.folderId })
    .then((e) => {
      if (e.data.deleteFolder) {
        router.push(`${data.value.folder.parentFolder.id}`);
        deleteFolderModal.value = false;
      }
    });
};

let updateClicked = (i: number) => {
  console.log(data.value.folder.subfolders[i]);
  updateFolder.value = data.value.folder.subfolders[i];
};
</script>

<style scoped>
.explorer {
  display: grid;
  grid-template-columns: repeat(auto-fit, 9em);
  grid-auto-rows: 9em;
  gap: 0.5em;
  margin-bottom: 1em;
}
</style>
