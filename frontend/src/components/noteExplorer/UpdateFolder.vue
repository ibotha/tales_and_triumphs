<template>
  <div class="container">
    <FormComponent
      :fields="formFields"
      v-on:submitted="submit"
      :parent-errors="parentErrors"
    >
      <TitleComponent text="Update Folder"> </TitleComponent>
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

const props = defineProps(["folder"]);

const emit = defineEmits(["success"]);

const route = useRoute();
const updateFolder = useMutation(gql`
  mutation UpdateFolder($name: String!, $id: String!, $colour: String!) {
    updateFolder(name: $name, id: $id, colour: $colour) {
      id
      name
      colour
    }
  }
`);

const formFields = {
  name: {
    label: "Name",
    placeholder: "Jensin",
    initialValue: props.folder.name,
  },
  colour: {
    type: "colour",
    label: "Colour",
    initialValue: props.folder.colour,
  },
};

const submit = (s: any) => {
  console.log(s);
  updateFolder
    .executeMutation({
      name: s.name,
      id: props.folder.id,
      colour: s.colour,
    })
    .then((e) => {
      console.log(e);
      if (!e.data.updateFolder.data) return;
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
