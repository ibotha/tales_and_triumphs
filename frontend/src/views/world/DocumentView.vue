<template>
  <div>
    <div style="display: flex; gap: 0.5em">
      <router-link
        class="btn"
        :to="`/world/${$route.params.worldId}/folder/${data.document.parentFolder.id}`"
        ><i class="fa fa-caret-left" aria-hidden="true"></i
      ></router-link>
      <div
        style="background-color: brown"
        v-if="data.document.editable"
        class="btn"
        @click="deleteDocumentModal = true"
      >
        Delete
      </div>
    </div>

    <TitleComponent :text="data.document.name" />
    <DocumentEditor
      v-model="content"
      :editable="data.document.editable"
    ></DocumentEditor>
    <DocumentPermissions
      :documentId="($route.params.documentId as string)"
      :worldId="($route.params.worldId as string)"
    />
    <ModalComponent
      v-if="deleteDocumentModal"
      @close="deleteDocumentModal = false"
    >
      <ConfirmComponent @no="deleteDocumentModal = false" @yes="deleteDocument">
        <h2 style="max-width: 30ch; text-align: center; margin-bottom: 1em">
          Are you sure you want to delete this document?
        </h2>
      </ConfirmComponent>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import TitleComponent from "../../components/structure/TitleComponent.vue";
import DocumentPermissions from "../../components/documentEditor/DocumentPermissions.vue";
import { useQuery, gql, useMutation } from "@urql/vue";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ModalComponent from "../../components/structure/ModalComponent.vue";
import ConfirmComponent from "../../components/structure/ConfirmComponent.vue";
import DocumentEditor from "../../components/documentEditor/DocumentEditor.vue";

const route = useRoute();
const router = useRouter();

let documentId = computed(() => {
  return route.params.documentId as string;
});

let deleteDocumentModal = ref(false);

const { fetching, data, error } = await useQuery({
  query: gql`
    query Document($id: String!) {
      document(id: $id) {
        id
        name
        content
        editable
        parentFolder {
          id
        }
      }
    }
  `,
  variables: {
    id: documentId,
  },
});

let content = ref(String(data.value.document.content));
console.log(data.value.document);
console.log(content.value);

const deleteDocumentMutation = useMutation(gql`
  mutation DeleteDocument($id: String!) {
    deleteDocument(id: $id)
  }
`);

let deleteDocument = () => {
  deleteDocumentMutation.executeMutation({ id: documentId.value }).then((e) => {
    if (e.data.deleteDocument) {
      router.push(
        `/world/${route.params.worldId}/folder/${data.value.document.parentFolder.id}`
      );
      deleteDocumentModal.value = false;
    }
  });
};
</script>

<style scoped></style>
