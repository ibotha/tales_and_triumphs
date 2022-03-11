<template>
  <div>
    <FormComponent
      v-on:submitted="submitRegister"
      :fields="{
        email: {
          initialValue: '',
          label: 'Email',
          placeholder: 'you@example.com',
        },
        username: {
          initialValue: '',
          label: 'Username',
          placeholder: 'DankMaster123',
        },
        password: {
          initialValue: '',
          label: 'Password',
          type: 'password',
          placeholder: 'password',
        },
        confirmPassword: {
          initialValue: '',
          label: 'Confirm Password',
          type: 'password',
          placeholder: 'confirm',
        },
      }"
      :validatorSchema="registerValidator"
      :parent-errors="formErrors"
    >
      <h2>Register</h2>
    </FormComponent>
  </div>
</template>

<script setup lang="ts">
import { gql, useMutation } from "@urql/vue";
import * as Yup from "yup";
import FormComponent from "@/components/Form/FormComponent.vue";
import { type Ref, ref } from "vue";
import { convertFieldErrors } from "@/util/errors";
import { useRouter } from "vue-router";

const router = useRouter();

defineEmits(["userRegistered"]);

let formErrors: Ref<{ [key: string]: string[] }> = ref({});

let registerValidator = {
  email: Yup.string().email("not a valid email").required(),
  password: Yup.string()
    .min(8)
    .max(50)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/, {
      message:
        "must contain 1 upper case, lower case, numeric, and special character",
    }),
  confirmPassword: Yup.string().test(
    "password",
    "must match password",
    function (confirm) {
      if (this.parent.password !== confirm) return false;
      return true;
    }
  ),
  username: Yup.string()
    .matches(/^[a-zA-Z\d]+$/, "must only contain letters and numbers")
    .min(3)
    .max(30),
};

let register = useMutation(gql`
  mutation Register($email: String!, $password: String!, $username: String!) {
    register(email: $email, password: $password, username: $username) {
      data {
        id
        username
        email
      }
      errors
      fieldErrors {
        field
        message
      }
    }
  }
`);

function submitRegister(registerFormValues: {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}) {
  let { confirmPassword, ...submitValues } = registerFormValues;
  if (confirmPassword === submitValues.password) {
    register
      .executeMutation(submitValues)
      .then((ret) => {
        let {
          data: { register: registerData },
        } = ret;
        if (registerData) {
          let { fieldErrors } = registerData;

          if (fieldErrors) {
            let val = convertFieldErrors(fieldErrors);
            formErrors.value = val;
          } else {
            router.push("login");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
</script>

<style scoped></style>
