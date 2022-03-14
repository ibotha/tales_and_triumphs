<script setup lang="ts">
import { gql, useMutation } from "@urql/vue";

let logoutMutation = useMutation(gql`
  mutation {
    logout
  }
`);
</script>

<template>
  <div v-on:click="logoutMutation.executeMutation({})"><slot>Logout</slot></div>
</template>

<style lang="scss" scoped></style>
