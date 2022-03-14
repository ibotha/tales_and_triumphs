<script setup lang="ts">
import { gql, useQuery } from "@urql/vue";
import LogoutButton from "@/components/userControl/LogoutButton.vue";
import TitleComponent from "../components/structure/TitleComponent.vue";
import SideHeader from "../components/structure/SideHeader.vue";
import { RouterView } from "vue-router";

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
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">Oof</div>
  <div v-else-if="data.me === null">{{ $router.push("/landing") }}</div>
  <SideHeader v-else>
    <template v-slot:header>
      <div style="margin-bottom: 1em">
        <TitleComponent style="margin-top: 1em" text="Home"
          >Welcome {{ data.me?.username }}
        </TitleComponent>
        <LogoutButton class="btn" />
      </div>
    </template>
    <template v-slot:dropdown>
      <router-link to="/home/worlds" class="muted"
        ><div>Worlds</div></router-link
      >
    </template>
    <RouterView />
  </SideHeader>
</template>

<style scoped lang="scss"></style>
