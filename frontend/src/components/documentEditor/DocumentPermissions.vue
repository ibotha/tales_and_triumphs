<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">Oof</div>
  <div v-else class="document-permissions">
    <div style="display: flex">
      <div>Editors:</div>
      <div class="username-badge-list">
        <div
          class="username-badge"
          v-for="u in edit"
          :key="u.id"
          @click="removeEditor(u)"
        >
          {{ u.username }}
        </div>
      </div>
      <div
        v-if="data.document.editable"
        class="btn"
        style="margin-left: auto; padding: 0 0.5em"
        @click="addEditors = true"
      >
        +
      </div>
      <ModalComponent v-if="addEditors" @close="addEditors = false">
        <div v-for="u in potentialEditors" :key="u.id" @click="addEditor(u)">
          {{ u.username }}
        </div>
      </ModalComponent>
    </div>
    <div style="display: flex">
      <div>Readers:</div>
      <div class="username-badge-list">
        <div
          class="username-badge"
          v-for="u in readOnly"
          :key="u.id"
          @click="removeReader(u)"
        >
          {{ u.username }}
        </div>
      </div>
      <div
        v-if="data.document.editable"
        class="btn"
        style="margin-left: auto; padding: 0 0.5em"
        @click="addReaders = true"
      >
        +
      </div>
      <ModalComponent v-if="addReaders" @close="addReaders = false">
        <div v-for="u in potentialReaders" :key="u.id" @click="addReader(u)">
          {{ u.username }}
        </div>
      </ModalComponent>
    </div>
    <div style="display: flex; gap: 0.5em">
      Read:
      <Dropdown
        :options="['ADMIN', 'TRUSTED', 'USER', 'PUBLIC']"
        v-model="readAccessLevel"
      ></Dropdown>
    </div>
    <div style="display: flex; gap: 0.5em">
      Write:
      <Dropdown
        :options="['ADMIN', 'TRUSTED', 'USER', 'PUBLIC']"
        v-model="writeAccessLevel"
      ></Dropdown>
    </div>
    <div v-if="isDifferent" class="btn" @click="save()">Save</div>
  </div>
</template>

<script setup lang="ts">
import { useQuery, gql, useMutation } from "@urql/vue";
import { computed, ref } from "vue";
import Dropdown from "../form/Dropdown.vue";
import ModalComponent from "../structure/ModalComponent.vue";

const props = defineProps({
  documentId: String,
  worldId: String,
});

const { fetching, data, error } = await useQuery({
  query: gql`
    query DocumentPermissions($id: String!, $worldId: String!) {
      document(id: $id) {
        id
        editable
        edit {
          id
          username
        }
        readOnly {
          id
          username
        }
        readAccessLevel
        writeAccessLevel
      }
      world(id: $worldId) {
        id
        roles {
          id
          user {
            id
            username
          }
        }
      }
    }
  `,
  variables: {
    id: props.documentId,
    worldId: props.worldId,
  },
});

let readAccessLevel = ref(String(data.value?.document?.readAccessLevel));
let writeAccessLevel = ref(String(data.value?.document?.writeAccessLevel));

let addEditors = ref(false);
let edit = ref([...data.value.document.edit]);

let potentialEditors = computed(() => {
  return data.value.world.roles
    .map((r: { user: { id: string } }) => {
      return r.user;
    })
    .filter((r: { id: string }) => {
      return !edit.value.find((u: { id: string }) => {
        return u.id === r.id;
      });
    });
});

let addReaders = ref(false);
let readOnly = ref([...data.value.document.readOnly]);

let potentialReaders = computed(() => {
  return data.value.world.roles
    .map((r: { user: { id: string } }) => {
      return r.user;
    })
    .filter((r: { id: string }) => {
      return !readOnly.value.find((u: { id: string }) => {
        return u.id === r.id;
      });
    });
});

const calculateDiff = () => {
  let prevEditIds = data.value.document.edit.map((u: { id: string }) => u.id);
  let currentEditIds = edit.value.map((u) => u.id);
  let newEditors = currentEditIds.filter((a) => !prevEditIds.includes(a));

  let prevReadIds = data.value.document.readOnly.map(
    (u: { id: string }) => u.id
  );
  let currentReadIds = readOnly.value.map((u) => u.id);
  let newReaders = currentReadIds.filter((a) => !prevReadIds.includes(a));

  let allOld = [...new Set([...prevEditIds, ...prevReadIds])];
  let allNew = [...new Set([...currentEditIds, ...currentReadIds])];
  let revokes = allOld.filter((x) => !allNew.includes(x));

  return {
    revokeUsers: revokes.length !== 0 ? revokes : undefined,
    newReadOnlyUsers: newReaders.length !== 0 ? newReaders : undefined,
    newEditorUsers: newEditors.length !== 0 ? newEditors : undefined,
    writeAccessLevel:
      writeAccessLevel.value != data.value.document.writeAccessLevel
        ? writeAccessLevel.value
        : undefined,
    readAccessLevel:
      readAccessLevel.value != data.value.document.readAccessLevel
        ? readAccessLevel.value
        : undefined,
  };
};

let isDifferent = computed(() => {
  let diff = calculateDiff();
  return !!(
    diff.newEditorUsers ||
    diff.newReadOnlyUsers ||
    diff.readAccessLevel ||
    diff.revokeUsers ||
    diff.writeAccessLevel
  );
});

const updateMutation = useMutation(gql`
  mutation UpdateDocumentPermissions(
    $id: String!
    $writeAccessLevel: RoleLevel
    $readAccessLevel: RoleLevel
    $newEditorUsers: [String!]
    $newReadOnlyUsers: [String!]
    $revokeUsers: [String!]
  ) {
    updateDocument(
      id: $id
      writeAccessLevel: $writeAccessLevel
      readAccessLevel: $readAccessLevel
      newEditorUsers: $newEditorUsers
      newReadOnlyUsers: $newReadOnlyUsers
      revokeUsers: $revokeUsers
    ) {
      id
      writeAccessLevel
      readAccessLevel
      edit {
        id
        username
      }
      readOnly {
        id
        username
      }
    }
  }
`);

const save = async () => {
  await updateMutation.executeMutation({
    id: props.documentId,
    ...calculateDiff(),
  });
};

const addEditor = (u: { id: string }) => {
  edit.value.push(u);
  removeReader(u);
};

const removeEditor = (u: { id: string }) => {
  edit.value = edit.value.filter((e: { id: string }) => u.id != e.id);
};

const addReader = (u: { id: string }) => {
  readOnly.value.push(u);
  removeEditor(u);
};

const removeReader = (u: { id: string }) => {
  readOnly.value = readOnly.value.filter((e: { id: string }) => u.id != e.id);
};
</script>

<style scoped>
.document-permissions {
  padding: 2em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  box-shadow: 2px 2px 15px inset rgba(49, 49, 49, 0.1);
  background-color: var(--bg-col);
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
