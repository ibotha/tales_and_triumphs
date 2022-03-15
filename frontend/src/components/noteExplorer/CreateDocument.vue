<template>
  <div class="container">
    <FormComponent
      :fields="formFields"
      v-on:submitted="submit"
      :parent-errors="parentErrors"
    >
      <TitleComponent text="Create Document"> </TitleComponent>
    </FormComponent>
  </div>
</template>

<script setup lang="ts">
import { gql, useMutation } from "@urql/vue";
import { ref, type Ref } from "vue";
import FormComponent from "@/components/form/FormComponent.vue";
import TitleComponent from "@/components/structure/TitleComponent.vue";
import { useRoute } from "vue-router";

let parentErrors: Ref<{ [key: string]: string }> = ref({});

const emit = defineEmits(["success"]);

const route = useRoute();
const createDocument = useMutation(gql`
  mutation CreateDocument(
    $name: String!
    $parentFolderId: String!
    $worldId: String!
  ) {
    createDocument(
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
    placeholder: "Jensin",
    initialValue: "",
  },
};

const submit = (s: any) => {
  createDocument
    .executeMutation({
      name: s.name,
      parentFolderId: route.params.folderId,
      worldId: route.params.worldId,
    })
    .then((e) => {
      console.log(e);
      if (!e.data.createDocument.data) return;
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
