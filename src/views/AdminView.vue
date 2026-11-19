<script setup>
import { ref, onMounted } from "vue";
import http from "@/api/http";
import NavBar from "@/components/NavBar.vue";

const users = ref([]);
const uPage = ref(1);
const uTotalPages = ref(1);

const notes = ref([]);
const nPage = ref(1);
const nTotalPages = ref(1);

const limit = 5;
const error = ref("");

const form = ref({ name: "", email: "", password: "", role: "user", interests: "" });
const editingId = ref(null);

const loadUsers = async () => {
  try {
    const { data } = await http.get("/admin/users", { params: { page: uPage.value, limit } });
    users.value = data.data;
    uTotalPages.value = data.totalPages || 1;
  } catch (e) {
    error.value = e.response?.data?.message || "Failed to load users";
  }
};

const loadNotes = async () => {
  try {
    const { data } = await http.get("/admin/notes", { params: { page: nPage.value, limit } });
    notes.value = data.data;
    nTotalPages.value = data.totalPages || 1;
  } catch (e) {
    error.value = e.response?.data?.message || "Failed to load notes";
  }
};

const resetForm = () => {
  editingId.value = null;
  form.value = { name: "", email: "", password: "", role: "user", interests: "" };
};

const save = async () => {
  error.value = "";
  const body = {
    name: form.value.name,
    email: form.value.email,
    role: form.value.role,
    interests: form.value.interests.split(",").map((s) => s.trim()).filter(Boolean),
  };
  if (form.value.password) body.password = form.value.password;

  try {
    if (editingId.value) {
      await http.put(`/admin/users/${editingId.value}`, body);
    } else {
      await http.post("/admin/users", body);
    }
    resetForm();
    await loadUsers();
  } catch (e) {
    error.value = e.response?.data?.message || "Save failed";
  }
};

const edit = (u) => {
  editingId.value = u.id;
  form.value = {
    name: u.name,
    email: u.email,
    password: "",
    role: u.role,
    interests: (u.interests || []).join(", "),
  };
};

const remove = async (id) => {
  if (!confirm("Delete this user and all their notes/posts?")) return;
  try {
    await http.delete(`/admin/users/${id}`);
    if (users.value.length === 1 && uPage.value > 1) uPage.value--;
    await loadUsers();
    await loadNotes();
  } catch (e) {
    error.value = e.response?.data?.message || "Delete failed";
  }
};

const goUsers = (p) => {
  uPage.value = p;
  loadUsers();
};
const goNotes = (p) => {
  nPage.value = p;
  loadNotes();
};

onMounted(() => {
  loadUsers();
  loadNotes();
});
</script>

<template>
  <div class="wide">
    <NavBar />

    <div class="card full">
      <h2>{{ editingId ? "Edit User" : "Add User" }}</h2>
      <input v-model="form.name" placeholder="Name" />
      <input v-model="form.email" placeholder="Email" />
      <input v-model="form.password" type="password"
             :placeholder="editingId ? 'New password (optional)' : 'Password'" />
      <select v-model="form.role">
        <option value="user">user</option>
        <option value="admin">admin</option>
      </select>
      <input v-model="form.interests" placeholder="Interests (comma separated)" />
      <button @click="save">{{ editingId ? "Update" : "Add" }}</button>
      <button v-if="editingId" class="gray" @click="resetForm">Cancel</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <div class="card full">
      <h2>All Users</h2>
      <div v-for="u in users" :key="u.id" class="item">
        <div class="item-body">
          <strong>{{ u.name }}</strong> ({{ u.role }})
          <p>{{ u.email }}</p>
          <p>{{ (u.interests || []).join(", ") }}</p>
        </div>
        <div class="item-actions">
          <button class="small" @click="edit(u)">Edit</button>
          <button class="small red" @click="remove(u.id)">Delete</button>
        </div>
      </div>
      <div class="pager">
        <button class="small" :disabled="uPage <= 1" @click="goUsers(uPage - 1)">Prev</button>
        <span>{{ uPage }} / {{ uTotalPages }}</span>
        <button class="small" :disabled="uPage >= uTotalPages" @click="goUsers(uPage + 1)">Next</button>
      </div>
    </div>

    <div class="card full">
      <h2>All Notes</h2>
      <div v-for="n in notes" :key="n._id" class="item">
        <div class="item-body">
          <strong>{{ n.title }}</strong>
          <p>{{ n.content }}</p>
          <p>by {{ n.owner?.name }} ({{ n.owner?.email }})</p>
        </div>
      </div>
      <div class="pager">
        <button class="small" :disabled="nPage <= 1" @click="goNotes(nPage - 1)">Prev</button>
        <span>{{ nPage }} / {{ nTotalPages }}</span>
        <button class="small" :disabled="nPage >= nTotalPages" @click="goNotes(nPage + 1)">Next</button>
      </div>
    </div>
  </div>
</template>