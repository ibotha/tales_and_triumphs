<template>
  <div class="modal" @click="$emit('close')">
    <div class="modal-content" v-on:click.stop="">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(["close"]);
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  z-index: 20;
  background-color: rgb(0.1, 0.1, 0.1, 0.5);
  display: flex;
}

.modal-content {
  background-color: var(--color-background);
  padding: 1em;
  margin: auto;
  max-width: 60ch;
}
</style>
