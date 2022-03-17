<script setup lang="ts">
import { gql, useMutation, useQuery } from "@urql/vue";

let logoutMutation = useMutation(gql`
  mutation {
    logout
  }
`);

const { fetching, data, error } = useQuery({
  query: gql`
    {
      me {
        id
        username
      }
    }
  `,
});
</script>

<template>
  <div
    v-on:click="
      logoutMutation.executeMutation({}).then(() => {
        $router.push('/');
      })
    "
  >
    <div class="auto-contrast">
      <slot
        ><span style="font-weight: bold; color: black">{{
          fetching ? "" : data.me.username + " | "
        }}</span
        >Logout</slot
      >
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
