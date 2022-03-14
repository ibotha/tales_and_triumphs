<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">Oof</div>
  <div v-else class="container">
    <div>
      <div class="title"></div>
    </div>
    <SideHeader>
      <template v-slot:header>
        <router-link to="/home" class="home">&lt;&lt;</router-link>
        <TitleComponent :text="data.world.name" style="margin: 0 auto 0 0.5em">
        </TitleComponent>
        <LogoutButton class="home" />
      </template>
      <template v-slot:dropdown>
        <router-link to="users" class="muted"><div>Users</div></router-link>
        <router-link to="folder" class="muted"><div>Notes</div></router-link>
        <router-link to="categories" class="muted"
          ><div>Categories</div></router-link
        >
        <router-link to="templates" class="muted"
          ><div>Templates</div></router-link
        >
      </template>
      <RouterView />
    </SideHeader>
    <main>
      <div>
        <h2>Users</h2>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useQuery, gql } from "@urql/vue";
import { useRoute, RouterView } from "vue-router";
import TitleComponent from "../components/structure/TitleComponent.vue";
import LogoutButton from "../components/userControl/LogoutButton.vue";
import SideHeader from "../components/structure/SideHeader.vue";

const route = useRoute();

const { fetching, data, error } = useQuery({
  query: gql`
    query World($id: String!) {
      world(id: $id) {
        id
        name
        users {
          id
          username
          role(worldId: $id) {
            id
            level
          }
        }
      }
    }
  `,
  variables: {
    id: route.params.worldId,
  },
});
</script>

<style scoped>
.title {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid var(--color-background-mute);
}

.home {
  background-color: var(--color-secondary);
  color: var(--color-text-light-1);
  padding: 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.home:hover {
  background-color: var(--color-secondary-soft);
}

main {
  padding: 1em;
}
</style>
