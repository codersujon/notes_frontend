<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import http from "@/api/http";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const interests = ref("");
const error = ref("");

const submit = async () => {
  error.value = "";
  try {

    const { data } = await http.post("/auth/register", {
      name: name.value,
      email: email.value,
      password: password.value,
      interests: interests.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    router.push("/notes");

  } catch (e) {
    error.value = e.response?.data?.message || "Register failed";
  }
};
</script>

<template>
  <div class="card">
      <h2>Register</h2>
      <input v-model="name" placeholder="Name" />
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <input v-model="interests" placeholder="Interests (comma separated)" />
      <button @click="submit">Register</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p class="link">Have an account? <RouterLink to="/login">Login</RouterLink></p>
    </div>
</template>