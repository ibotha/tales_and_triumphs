import { createRouter, createWebHistory } from "vue-router";

import LandingPage from "../views/LandingPage.vue";
import Home from "../views/Home.vue";
import LoginVue from "@/views/forms/Login.vue";
import RegisterVue from "@/views/forms/Register.vue";
import WorldVue from "@/views/World.vue";
import c404 from "@/views/404.vue";
import InviteVue from "@/views/Invite.vue";
import NoteExplorerVue from "@/views/world/NoteExplorer.vue";
import DocumentViewVue from "@/views/world/DocumentView.vue";
import WorldsViewVue from "@/views/home/WorldsView.vue";
import CreateWorld from "@/views/CreateWorld.vue";
import UserManagementView from "@/views/world/UserManagementView.vue";
import CreateFolder from "@/views/world/CreateFolder.vue";
import CreateDocument from "@/views/world/CreateDocument.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/landing",
      name: "landing",
      component: LandingPage,
      children: [
        {
          path: "login",
          name: "login",
          component: LoginVue,
        },
        {
          path: "register",
          name: "register",
          component: RegisterVue,
        },
      ],
      redirect: { name: "login" },
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      children: [{ path: "worlds", name: "worlds", component: WorldsViewVue }],
    },
    {
      path: "/world/:worldId/",
      name: "world",
      redirect: { name: "folder" },
      component: WorldVue,
      children: [
        {
          path: "folder/:folderId?",
          name: "folder",
          component: NoteExplorerVue,
        },
        {
          path: "folder/:folderId?/createFolder",
          name: "createFolder",
          component: CreateFolder,
        },
        {
          path: "folder/:folderId?/createDocument",
          name: "createDocument",
          component: CreateDocument,
        },
        {
          path: "document/:documentId?",
          name: "document",
          component: DocumentViewVue,
        },
        {
          path: "users",
          name: "users",
          component: UserManagementView,
        },
        {
          path: "categories",
          name: "categories",
          component: DocumentViewVue,
        },
        {
          path: "templates",
          name: "templates",
          component: DocumentViewVue,
        },
      ],
    },
    {
      path: "/world/:worldId/invite",
      name: "worldInvite",
      component: InviteVue,
    },
    {
      path: "/createWorld",
      name: "createWorld",
      component: CreateWorld,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "catchAll",
      component: c404,
    },
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import("../views/AboutView.vue"),
    // },
  ],
});

export default router;
