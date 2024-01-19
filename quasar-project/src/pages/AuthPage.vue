<template>
  <q-page class="overflow-hidden">
    <q-card class="constraint">
      <q-tabs
        v-model="tab"
        dense
        narrow-indicator
        class="text-grey q-ma-sm"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="Login" label="Login" />
        <q-tab name="Register" label="Register" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Login">
          <LoginAndRegisterForm :tab="tab" />
        </q-tab-panel>

        <q-tab-panel name="Register">
          <LoginAndRegisterForm :tab="tab" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import LoginAndRegisterForm from "src/components/LoginAndRegisterForm.vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUsersStore } from "stores/users";

const tab = ref("Login");

const router = useRouter();
const store = useUsersStore();

onMounted(() => {
  if (Object.keys(store.userDetails).length) {
    router.push("/");
  }
});
</script>
