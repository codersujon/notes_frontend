<script setup>
import { ref, onMounted } from "vue";
import http from "@/api/http";
import NavBar from "@/components/NavBar.vue";

const groups = ref([]);
const page = ref(1);
const totalPages = ref(1);
const limit = 5;
const error = ref("");

const load = async () => {
  try {
    const { data } = await http.get("/users/grouped-by-interests", {
      params: { page: page.value, limit },
    });
    groups.value = data.data;
    totalPages.value = data.totalPages || 1;
  } catch (e) {
    error.value = e.response?.data?.message || "Failed to load";
  }
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
      <h2>Users by Interest</h2>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="!groups.length && !error">No data.</p>

      <div v-for="g in groups" :key="g._id" class="item">
        <div class="item-body">
          <strong>{{ g._id }} ({{ g.count }})</strong>
          <p v-for="u in g.users" :key="u.id">{{ u.name }} — {{ u.id }}</p>
        </div>
      </div>

      <div class="pager">
        <button class="small" :disabled="page <= 1" @click="go(page - 1)">Prev</button>
        <span>{{ page }} / {{ totalPages }}</span>
        <button class="small" :disabled="page >= totalPages" @click="go(page + 1)">Next</button>
      </div>
    </div>
  </div>
</template>