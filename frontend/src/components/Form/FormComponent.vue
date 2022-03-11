<template>
  <form>
    <slot></slot>
    <hr />
    <div class="fields">
      <FormField
        v-for="(field, name) in fields"
        :key="name"
        :label="field.label"
        :placeholder="field.placeholder"
        :type="field.type"
        :value="fieldData[name]"
        v-on:input="(e) => {validate(name as string); fieldData[name] = e.target.value}"
        v-on:change="setTouched(name as string)"
        :touched="fieldTouched[name]"
        :errors="fieldErrors[name]"
        :parent-errors="parentErrors[name]"
      />
    </div>
    <input
      class="btn"
      v-bind:disabled="hasErrors"
      @click="
        async () => {
          await validate(undefined);
          if (!hasErrors) {
            $emit('submitted', fieldData);
            reset();
          } else {
            exposeErrors();
          }
        }
      "
      type="button"
      value="Submit"
    />
  </form>
  <slot name="after"></slot>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import * as Yup from "yup";
import FormField from "./FormField.vue";

type tFields = {
  [key: string]: {
    type: "button" | "textarea" | "checkbox" | undefined;
    initialValue?: string | boolean;
    label?: string;
    placeholder?: string;
  };
};

defineEmits(["submitted"]);
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
  margin-top: 1em;
}

form {
  padding: 1em 0.5em;
  background-color: var(--color-background-mute);
  max-width: 60ch;
  margin: 1em;
  padding: 2em;
}
</style>
