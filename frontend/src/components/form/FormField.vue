<template>
  <div class="form-field">
    <div class="input-container">
      <div class="label">{{ label }}:</div>
      <div
        v-if="type === 'radio'"
        style="width: 100%; text-align: start; align-items: center"
      >
        <div v-for="(o, i) in options" :key="i" style="">
          <input
            :id="name! + i"
            :value="o.value !== undefined ? o.value : o"
            :name="name"
            type="radio"
            v-on:input="input"
            v-on:change="change"
          />
          {{ o.name ? o.name : o }}
        </div>
      </div>
      <div v-else-if="type === 'colour'">
        <ColorPicker
          :color="value"
          @color-change="updateColour"
          :visible-formats="['hex']"
          alpha-channel="hide"
        >
          <template v-slot:copy-button><div></div></template>
        </ColorPicker>
      </div>
      <div
        v-else
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
          :name="name"
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
import { ColorPicker } from "vue-accessible-color-picker";
let emit = defineEmits(["change", "input"]);

let props = defineProps({
  placeholder: String,
  label: String,
  name: String,
  type: String,
  value: null,
  errors: Array,
  parentErrors: Array,
  options: Array,
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
let updateColour = (e: any) => {
  emit("input", { target: { value: e.colors.hex.substring(0, 7) } });
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
  gap: 1em;
  display: grid;
  grid-template-columns: 2fr 3fr;
  justify-items: right;
}

.radio-container {
  gap: 1em;
  display: grid;
  grid-template-columns: 2fr 3fr;
  justify-items: right;
}
</style>
