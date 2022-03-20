<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div>
    <Suspense>
      <RouterView />
      <template #fallback> Loading... </template>
    </Suspense>
  </div>
</template>

<style>
@import "@/assets/base.css";
</style>
