import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import NotesView from "@/views/NotesView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/notes" },
    { path: "/login", component: LoginView },
    { path: "/register", component: RegisterView },
    { path: "/notes", component: NotesView, meta: { auth: true } },
  ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  if (to.meta.auth && !token) return "/login";
});

export default router;