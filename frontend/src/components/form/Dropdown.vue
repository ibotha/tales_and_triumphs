<template>
  <div class="dropdown" @click="showDropdown = !showDropdown">
    {{ modelValue }}
    <div class="dropdown-panel" v-if="showDropdown">
      <div
        v-for="(o, i) in options"
        :key="i"
        @click="$emit('update:modelValue', o)"
        :class="o == modelValue ? 'selected' : ''"
      >
        {{ o }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["options", "modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const showDropdown = ref(false);
</script>

<style scoped>
.dropdown {
  position: relative;
  background-color: var(--color-background);
  padding: 0 0.5em;
  width: fit-content;
}
.dropdown-panel {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: var(--color-background);
  padding: 0.25em 0.5em;
}
.selected {
  background-color: var(--color-background-soft);
  padding: 0 0.5em;
}
</style>
