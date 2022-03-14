<template>
  <div>
    <WorldList />
    <router-link to="/createWorld"><div class="btn">+</div></router-link>
  </div>
</template>

<script setup lang="ts">
import WorldList from "../../components/world/WorldList.vue";
</script>

<style scoped></style>
