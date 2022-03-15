<template>
  <div class="form-container">
    <form
      v-on:keyup="
        (e) => {
          if (e.key == 'Enter') submit();
        }
      "
    >
      <slot></slot>
      <hr />
      <div class="fields">
        <FormField
          v-for="(field, name) in fields"
          :key="name"
          :name="(name as string)"
          :label="field.label"
          :placeholder="field.placeholder"
          :type="field.type"
          :value="fieldData[name]"
          v-on:input="(e) => {validate(name as string); fieldData[name] = e.target.value}"
          v-on:change="(e) => {setTouched(name as string); validate(name as string);}"
          :touched="fieldTouched[name]"
          :errors="fieldErrors[name]"
          :parent-errors="parentErrors ? parentErrors[name] : []"
          :options="field.options"
        />
        <div class="btn" v-bind:disabled="hasErrors" @click="submit">
          Submit
        </div>
      </div>
      <slot name="after"></slot>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import * as Yup from "yup";
import FormField from "./FormField.vue";

type tFields = {
  [key: string]: {
    type: "button" | "textarea" | "checkbox" | "radio" | "colour" | undefined;
    initialValue?: string | boolean;
    label?: string;
    placeholder?: string;
    options?: string[];
  };
};

const emit = defineEmits(["submitted"]);
const props = defineProps({
  fields: Object,
  title: String,
  validatorSchema: Object,
  parentErrors: null,
});

// Field Metadata
let fields = props.fields as tFields;

let fieldData: Ref<{ [key: string]: string | boolean }> = ref({});
let fieldErrors: Ref<{ [key: string]: string[] }> = ref({});
let fieldTouched: Ref<{ [key: string]: boolean }> = ref({});

for (var fieldName in fields) {
  fieldData.value[fieldName] = fields[fieldName].initialValue || "";
  fieldErrors.value[fieldName] = [];
  fieldTouched.value[fieldName] = false;
}

function setTouched(f: string) {
  fieldTouched.value[f] = true;
}

let submit = async () => {
  await validate(undefined);
  if (!hasErrors.value) {
    emit("submitted", fieldData.value);
    reset();
  } else {
    exposeErrors();
  }
};

function reset() {
  fieldErrors.value = {};
  fieldTouched.value = {};

  let errors: { [key: string]: string[] } = {};
  for (var fieldName in fields) {
    errors[fieldName] = [];
    fieldTouched.value[fieldName] = false;
  }
  fieldErrors.value = errors;
}

let exposeErrors = () => {
  for (var fieldName in fields) {
    fieldTouched.value[fieldName] = true;
  }
};

// Validation
let hasErrors = ref(false);
let validator = props.validatorSchema
  ? Yup.object(props.validatorSchema as any)
  : null;

async function validate(field: string | undefined) {
  for (var key in fieldErrors.value) {
    fieldErrors.value[key] = [];
  }
  if (!validator) return;
  try {
    validator.validateSync(fieldData.value, { abortEarly: false });
    if (field) fieldErrors.value[field] = [];
    hasErrors.value = false;
  } catch (e: any) {
    let err = e as Yup.ValidationError;
    hasErrors.value = true;
    if (err.inner) {
      let newErrors = err.inner as Yup.ValidationError[];
      newErrors.forEach((err) => {
        if (!err.path) {
          console.log(err.message);
          return;
        }
        fieldErrors.value[err.path] = fieldErrors.value[err.path].concat([
          err.message,
        ]);
      });
    }
  }
}
</script>

<style scoped>
* + hr {
  margin-top: 1em;
}

.fields {
  padding: 1em 2em;
}

.form-container {
  margin: auto;
  max-width: 60ch;
  width: 100%;
  text-align: center;
}

form {
  padding: 1em;
  background-color: var(--color-background-mute);
  width: calc(100%);
}
</style>
