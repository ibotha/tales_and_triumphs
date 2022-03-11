import { createRouter, createWebHistory } from "vue-router";

import LandingPage from "../views/LandingPage.vue";
import Home from "../views/Home.vue";
import LoginVue from "@/views/forms/Login.vue";
import RegisterVue from "@/views/forms/Register.vue";

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
    },
    {
      path: "/:pathMatch(.*)*",
      name: "catchAll",
      redirect: "/landing",
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
