<template>
  <div class="container">
    <FormComponent
      :fields="formFields"
      v-on:submitted="submit"
      :parent-errors="parentErrors"
      ><TitleComponent text="Create World"> </TitleComponent>
      <template v-slot:after
        ><router-link class="btn" to="/home">Back</router-link></template
      ></FormComponent
    >
  </div>
</template>

<script setup lang="ts">
import { gql, useMutation } from "@urql/vue";
import { ref, type Ref } from "vue";
import { useRouter } from "vue-router";
import FormComponent from "@/components/form/FormComponent.vue";
import TitleComponent from "@/components/structure/TitleComponent.vue";

let parentErrors: Ref<{ [key: string]: string }> = ref({});

const router = useRouter();
const assignRole = useMutation(gql`
  mutation CreateWorld($name: String!) {
    createWorld(name: $name) {
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
    placeholder: "Australia",
    initialValue: "",
  },
};

const submit = (s: any) => {
  assignRole
    .executeMutation({
      name: s.name,
    })
    .then((e) => {
      console.log(e);
      if (!e.data.createWorld.data) return;
      router.push("/world/" + e.data.createWorld.data.id);
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
  height: 100vh;
}
</style>
