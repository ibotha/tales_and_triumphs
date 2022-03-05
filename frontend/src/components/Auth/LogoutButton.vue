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
    <button v-on:click="logoutMutation.executeMutation({})">Logout</button>
  </div>
</template>

<style lang="scss" scoped></style>
