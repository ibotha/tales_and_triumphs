<template>
  <h1>
    <slot>{{ text }}</slot>
  </h1>
</template>

<script setup lang="ts">
const props = defineProps(["text"]);

document.title = "T&T | " + props.text;
</script>

<style scoped></style>
