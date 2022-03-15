<template>
  <div class="container">
    <FormComponent
      :fields="formFields"
      v-on:submitted="submit"
      :parent-errors="parentErrors"
      ><TitleComponent text="Invite"> </TitleComponent>
      <template v-slot:after
        ><router-link class="btn" to="./">Back</router-link></template
      ></FormComponent
    >
  </div>
</template>

<script setup lang="ts">
import { gql, useMutation } from "@urql/vue";
import { ref, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import FormComponent from "@/components/form/FormComponent.vue";
import TitleComponent from "@/components/structure/TitleComponent.vue";

let parentErrors: Ref<{ [key: string]: string }> = ref({});

const route = useRoute();
const router = useRouter();
const assignRole = useMutation(gql`
  mutation AssignUserRole(
    $email: String!
    $worldId: String!
    $level: RoleLevel
  ) {
    assignWorldRole(worldId: $worldId, userEmail: $email, level: $level) {
      data {
        id
        level
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
  email: {
    label: "Email",
    placeholder: "hoiti@toiti.com",
    initialValue: "",
  },
  level: {
    label: "Role",
    placeholder: "hoiti@toiti.com",
    type: "radio",
    options: ["ADMIN", "TRUSTED", "USER", { name: "NONE", value: "" }],
  },
};

const submit = (s: any) => {
  assignRole
    .executeMutation({
      email: s.email,
      worldId: route.params.worldId,
      level: s.level.length > 0 ? s.level : null,
    })
    .then((e) => {
      console.log(e);
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
