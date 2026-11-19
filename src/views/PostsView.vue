<script setup>
import { ref, onMounted } from "vue";
import http from "@/api/http";
import NavBar from "@/components/NavBar.vue";

const me = JSON.parse(localStorage.getItem("user") || "{}");

const title = ref("");
const content = ref("");
const error = ref("");

const userId = ref(me.id);
const author = ref(null);
const posts = ref([]);
const page = ref(1);
const limit = 5;

const load = async () => {
  error.value = "";
  try {
    const { data } = await http.get(`/users/${userId.value}/posts`, {
      params: { page: page.value, limit },
    });
    author.value = { name: data.name, email: data.email };
    posts.value = data.posts;
  } catch (e) {
    author.value = null;
    posts.value = [];
    error.value = e.response?.data?.message || "Failed to load posts";
  }
};

const create = async () => {
  error.value = "";
  if (!title.value) {
    error.value = "Title is required";
    return;
  }
  try {
    await http.post("/posts", { title: title.value, content: content.value });
    title.value = "";
    content.value = "";
    userId.value = me.id;
    page.value = 1;
    await load();
  } catch (e) {
    error.value = e.response?.data?.message || "Create failed";
  }
};

const search = () => {
  page.value = 1;
  load();
};

const go = (p) => {
  page.value = p;
  load();
};

onMounted(load);
</script>

<template>
  <div class="wide">
    <NavBar />

    <div class="card full">
      <h2>New Post</h2>
      <input v-model="title" placeholder="Title" />
      <textarea v-model="content" placeholder="Content"></textarea>
      <button @click="create">Publish</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <div class="card full">
      <h2>View User's Posts</h2>
      <input v-model="userId" placeholder="User id" />
      <button @click="search">Load</button>

      <p v-if="author" class="meta">Posts by {{ author.name }} ({{ author.email }})</p>
      <p v-if="author && !posts.length">No posts.</p>

      <div v-for="p in posts" :key="p._id" class="item">
        <div class="item-body">
          <strong>{{ p.title }}</strong>
          <p>{{ p.content }}</p>
        </div>
      </div>

      <div class="pager">
        <button class="small" :disabled="page <= 1" @click="go(page - 1)">Prev</button>
        <span>{{ page }}</span>
        <button class="small" :disabled="posts.length < limit" @click="go(page + 1)">Next</button>
      </div>
    </div>
  </div>
</template>