<template>
  <router-view />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUsersStore } from "stores/users";

const store = useUsersStore();

onMounted(() => {
  store.firebaseAuthStateChanged();
});
</script>
