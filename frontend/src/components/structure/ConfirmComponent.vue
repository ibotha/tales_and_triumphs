<template>
  <div>
    <slot>Are you sure?</slot>
    <div style="display: flex; gap: 1em; justify-content: space-around">
      <div class="btn" @click="$emit('yes')">Yes</div>
      <div class="btn" @click="$emit('no')">No</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(["yes", "no"]);
</script>

<style scoped></style>
