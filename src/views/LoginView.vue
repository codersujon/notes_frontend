<script setup>
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import http from "@/api/http";

    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const error = ref("");

    const submit = async () => {
        error.value = "";
        try {
            const { data } = await http.post("/auth/login", {
                email: email.value,
                password: password.value,
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/notes");

        } catch (e) {
            
            error.value = e.response?.data?.message || "Login failed";
        }
    };
</script>

<template lang="html">
   <div class="center">
        <div class="card">
            <h2>Login</h2>
            <input v-model="email" placeholder="Email" />
            <input v-model="password" type="password" placeholder="Password" />
            <button @click="submit">Login</button>
            <p v-if="error" class="error">{{ error }}</p>
            <p class="link">No account? <RouterLink to="/register">Register</RouterLink></p>
        </div>
   </div>
</template>

<style lang="css">
    
</style>