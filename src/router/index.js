import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import NotesView from "@/views/NotesView.vue";
import PostsView from "@/views/PostsView.vue";
import InterestsView from "@/views/InterestsView.vue";
import AdminView from "@/views/AdminView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/notes" },
    { path: "/login", component: LoginView },
    { path: "/register", component: RegisterView },
    { path: "/notes", component: NotesView, meta: { auth: true } },
    { path: "/posts", component: PostsView, meta: { auth: true } },
    { path: "/interests", component: InterestsView, meta: { auth: true } },
    { path: "/admin", component: AdminView, meta: { auth: true, admin: true } },
  ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (to.meta.auth && !token) return "/login";
  if (to.meta.admin && user.role !== "admin") return "/notes";
});

export default router;