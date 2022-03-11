<template>
  <div class="form-field">
    <div class="input-container">
      <div class="label">{{ label }}:</div>
      <div
        style="
          width: 100%;
          height: 100%;
          text-align: start;
          align-items: center;
        "
      >
        <input
          :placeholder="placeholder"
          v-bind:type="type"
          :value="value"
          v-on:input="input"
          v-on:change="change"
        />
      </div>
    </div>
    <div class="errors">
      <div v-if="touched || internalTouched">
        <div v-for="(error, index) in errors" :key="index">
          {{ error }}
        </div>
      </div>
      <div v-else-if="parentErrors">
        <div v-for="(error, index) in parentErrors" :key="index">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

let emit = defineEmits(["change", "input"]);

let props = defineProps({
  placeholder: String,
  label: String,
  type: String,
  value: null,
  errors: Array,
  parentErrors: [String],
  touched: Boolean,
});

let internalTouched = ref(false);

let change = (e: Event) => {
  emit("change", e);
  if (props.touched === undefined) internalTouched.value = true;
};
let input = (e: Event) => {
  emit("input", e);
};
</script>

<style scoped>
.form-field {
  padding-bottom: 1em;
}

.label {
  text-align: end;
}

.input-container {
  /* display: flex;
  flex-flow: row;
  justify-content: flex-end;
  padding: 0 1em 0 1em; */
  gap: 1em;
  display: grid;
  grid-template-columns: 2fr 3fr;
  justify-items: right;
}
</style>
