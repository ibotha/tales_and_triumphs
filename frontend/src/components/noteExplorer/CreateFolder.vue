<template>
  <div class="container">
    <FormComponent
      :fields="formFields"
      v-on:submitted="submit"
      :parent-errors="parentErrors"
    >
      <TitleComponent text="Create Folder"> </TitleComponent>
    </FormComponent>
  </div>
</template>

<script setup lang="ts">
import { gql, useMutation } from "@urql/vue";
import { ref, type Ref } from "vue";
import { useRoute } from "vue-router";
import FormComponent from "@/components/form/FormComponent.vue";
import TitleComponent from "@/components/structure/TitleComponent.vue";

let parentErrors: Ref<{ [key: string]: string }> = ref({});

const emit = defineEmits(["success"]);

const route = useRoute();
const createFolder = useMutation(gql`
  mutation CreateFolder(
    $name: String!
    $parentFolderId: String!
    $worldId: String!
  ) {
    createFolder(
      name: $name
      parentFolderId: $parentFolderId
      worldId: $worldId
    ) {
      data {
        id
        name
      }
      errors
      fieldErrors {
        field
        message
      }
    }
  }
`);

const formFields = {
  name: {
    label: "Name",
    placeholder: "Cities",
    initialValue: "",
  },
};

const submit = (s: any) => {
  createFolder
    .executeMutation({
      name: s.name,
      parentFolderId: route.params.folderId,
      worldId: route.params.worldId,
    })
    .then((e) => {
      console.log(e);
      if (!e.data.createFolder.data) return;
      emit("success");
    })
    .catch((err) => console.log(err));
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  justify-items: center;
}
</style>
