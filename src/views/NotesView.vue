<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import http from "@/api/http";
import NavBar from "@/components/NavBar.vue";

const router = useRouter();
const user = JSON.parse(localStorage.getItem("user") || "{}");

const notes = ref([]);
const page = ref(1);
const totalPages = ref(1);
const limit = 5;

const title = ref("");
const content = ref("");
const editingId = ref(null);
const error = ref("");

//** Note List Load */
const load = async () => {
  try {
    const { data } = await http.get("/notes", {
      params: { page: page.value, limit },
    });
    notes.value = data.data;
    totalPages.value = data.totalPages || 1;
  } catch (e) {
    error.value = e.response?.data?.message || "Failed to load notes";
  }
};

//** Save Note */
const save = async () => {
  error.value = "";
  if (!title.value) {
    error.value = "Title is required";
    return;
  }
  try {
    if (editingId.value) {
      await http.put(`/notes/${editingId.value}`, {
        title: title.value,
        content: content.value,
      });
    } else {
      await http.post("/notes", { title: title.value, content: content.value });
    }
    resetForm();
    await load();
  } catch (e) {
    error.value = e.response?.data?.message || "Save failed";
  }
};

//** Edit Note */
const edit = (note) => {
  editingId.value = note._id;
  title.value = note.title;
  content.value = note.content;
};

const resetForm = () => {
  editingId.value = null;
  title.value = "";
  content.value = "";
};

const remove = async (id) => {
  if (!confirm("Delete this note?")) return;
  try {
    await http.delete(`/notes/${id}`);
    // last page -> last note remove -> go to before
    if (notes.value.length === 1 && page.value > 1) page.value--;
    await load();
  } catch (e) {
    error.value = e.response?.data?.message || "Delete failed";
  }
};

const go = async (p) => {
  page.value = p;
  await load();
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};

onMounted(load);
</script>

<template>
  <div class="wide">

    <NavBar />

    <div class="card full">
      <h2>{{ editingId ? "Edit Note" : "New Note" }}</h2>
      <input v-model="title" placeholder="Title" />
      <textarea v-model="content" placeholder="Content"></textarea>
      <button @click="save">{{ editingId ? "Update" : "Add" }}</button>
      <button v-if="editingId" class="gray" @click="resetForm">Cancel</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <div class="card full">
      <h2>My Notes</h2>
      <p v-if="!notes.length">No notes yet.</p>

      <div v-for="n in notes" :key="n._id" class="item">
        <div class="item-body">
          <strong>{{ n.title }}</strong>
          <p>{{ n.content }}</p>
        </div>
        <div class="item-actions">
          <button class="small" @click="edit(n)">Edit</button>
          <button class="small red" @click="remove(n._id)">Delete</button>
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