<template>
  <div>
    <FormComponent
      v-on:submitted="submitLogin"
      :fields="{
        email: {
          initialValue: '',
          label: 'Email',
          placeholder: 'you@example.com',
        },
        password: {
          initialValue: '',
          label: 'Password',
          type: 'password',
          placeholder: 'password',
        },
      }"
      :validatorSchema="loginValidator"
      :parent-errors="formErrors"
    >
      <h2>Login</h2>
    </FormComponent>
  </div>
</template>

<script setup lang="ts">
import { gql, useMutation } from "@urql/vue";
import { ref, type Ref } from "vue";
import FormComponent from "@/components/Form/FormComponent.vue";
import * as Yup from "yup";
import { convertFieldErrors } from "@/util/errors";
import { useRouter } from "vue-router";

let router = useRouter();

let formErrors: Ref<{ [key: string]: string[] }> = ref({});

let loginValidator = {
  email: Yup.string().email("not a valid email").required(),
  password: Yup.string().required(),
};
// Login
let login = useMutation(gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      fieldErrors {
        field
        message
      }
    }
  }
`);

let submitLogin = (loginFormValues: { email: string; password: string }) => {
  login
    .executeMutation(loginFormValues)
    .then((ret) => {
      let {
        data: {
          login: { fieldErrors },
        },
      } = ret;
      if (fieldErrors) {
        let val = convertFieldErrors(fieldErrors);
        formErrors.value = val;
      } else {
        router.push("/home");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>

<style scoped></style>
