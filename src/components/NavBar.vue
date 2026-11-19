<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const user = JSON.parse(localStorage.getItem("user") || "{}");

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};
</script>

<template>
  <h1>Note Taking Platform</h1>
  <div class="bar">
    <span class="bar-right">
      <RouterLink to="/notes">Notes</RouterLink>
      <RouterLink to="/posts">Posts</RouterLink>
      <RouterLink to="/interests">Interests</RouterLink>
      <RouterLink v-if="user.role === 'admin'" to="/admin">Admin</RouterLink>
    </span>
    <span class="bar-right">
      <span>{{ user.name }} ({{ user.role }})</span>
      <button class="small" @click="logout">Logout</button>
    </span>
  </div>
</template>