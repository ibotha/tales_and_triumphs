<script setup lang="ts">
import { gql, useMutation } from "@urql/vue";

let logoutMutation = useMutation(gql`
  mutation {
    logout
  }
`);
</script>

<template>
  <div>
    <input
      value="Logout"
      type="button"
      class="btn"
      v-on:click="logoutMutation.executeMutation({})"
    />
  </div>
</template>

<style lang="scss" scoped></style>
