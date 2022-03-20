<template>
  <div v-if="fetching">Loading...</div>
  <div v-else-if="error">Oof</div>
  <div v-else class="container">
    <div>
      <div class="title"></div>
    </div>
    <SideHeader>
      <template v-slot:header>
        <TitleComponent :text="data.world.name" style="margin: 0 auto 0 0.5em">
        </TitleComponent>
      </template>
      <template v-slot:dropdown>
        <div style="display: grid; gap: 0.5em; margin-top: 1em">
          <router-link to="/home" class="large-link"
            ><div class="auto-contrast">Home</div></router-link
          >
          <LogoutButton class="large-link" />
          <router-link
            class="large-link"
            :to="`/world/${$route.params.worldId}/users`"
            ><div class="auto-contrast">Users</div></router-link
          >
          <router-link
            :to="`/world/${$route.params.worldId}/folder`"
            class="large-link"
            ><div class="auto-contrast">Notes</div></router-link
          >
          <router-link
            :to="`/world/${$route.params.worldId}/categories`"
            class="large-link"
            ><div class="auto-contrast">Categories</div></router-link
          >
          <router-link
            :to="`/world/${$route.params.worldId}/templates`"
            class="large-link"
            ><div class="auto-contrast">Templates</div></router-link
          >
          <div
            v-if="data.world.myRole === 'ADMIN'"
            @click="deleteWorldModal = true"
            class="large-link"
            style="background-color: brown"
          >
            <div class="auto-contrast">Delete World</div>
          </div>
        </div>
      </template>
      <RouterView />
    </SideHeader>
    <ModalComponent v-if="deleteWorldModal" @close="deleteWorldModal = false">
      <ConfirmComponent
        @no="deleteWorldModal = false"
        @yes="deleteWorld($route.params.worldId as string)"
      >
        <h2 style="max-width: 30ch; text-align: center; margin-bottom: 1em">
          Are you sure you want to delete your world?
        </h2>
      </ConfirmComponent>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import { useQuery, gql, useMutation } from "@urql/vue";
import { useRoute, RouterView } from "vue-router";
import TitleComponent from "../components/structure/TitleComponent.vue";
import LogoutButton from "../components/userControl/LogoutButton.vue";
import SideHeader from "../components/structure/SideHeader.vue";
import ModalComponent from "../components/structure/ModalComponent.vue";
import ConfirmComponent from "../components/structure/ConfirmComponent.vue";
import { ref } from "vue";
import router from "@/router";

const route = useRoute();
let deleteWorldModal = ref(false);
const { fetching, data, error } = useQuery({
  query: gql`
    query World($id: String!) {
      world(id: $id) {
        id
        name
        myRole
        roles {
          id
          user {
            id
            username
          }
          level
        }
      }
    }
  `,
  variables: {
    id: route.params.worldId,
  },
});

const deleteWorldMutation = useMutation(
  gql`
    mutation DeleteWorld($worldId: String!) {
      deleteWorld(id: $worldId)
    }
  `
);

const deleteWorld = async (worldId: string) => {
  const res = await deleteWorldMutation.executeMutation({
    worldId,
  });
  if (res.data.deleteWorld) router.push("/");
};
</script>

<style scoped>
.title {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid var(--color-background-mute);
}

.home:hover {
  background-color: var(--color-secondary-soft);
}

main {
  padding: 1em;
}
</style>
