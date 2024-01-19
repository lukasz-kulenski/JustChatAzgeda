<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="q-px-sm">
      <q-toolbar>
        <q-btn
          v-show="route.path.includes('/chat')"
          @click="router.push('/')"
          rounded
          flat
          no-caps
          dense
          color="white"
          icon="arrow_back"
          class="q-my-sm absolute-left lt-sm"
        />
        <q-btn
          v-show="
            (route.name == 'UsersPage' && $q.screen.width < 600) ||
            $q.screen.width > 599
          "
          @click="settingsStore.showSettings = true"
          flat
          round
          dense
          color="white"
          icon="settings"
        />
        <div class="absolute-center text-center flex-center">
          <span class="text-h5">{{ pageTitle }}</span> <br />
          <span
            v-if="
              otherUserDetails &&
              otherUserDetails.data.activeStatus &&
              usersStore &&
              usersStore.userDetails.activeStatus
            "
            class="text-subtitle1"
            >{{ lastOnline }}</span
          >
        </div>
        <q-btn
          v-if="route.path.includes('/chat')"
          @click="settingsBetweenUsersStore.showSettingsBetweenUsers = true"
          flat
          round
          dense
          color="white"
          icon="info"
          class="absolute-right q-my-sm"
        />
      </q-toolbar>
    </q-header>

    <Settings />
    <SettingsBetweenUsers />

    <q-page-container>
      <div
        class="row gt-xs"
        v-show="$q.screen.width > 599 && usersStore.userDetails.id"
      >
        <div class="col col-sm-4 col-md-3">
          <UsersPage class="usersPageDesktop" />
        </div>
        <div class="col-12 col-sm-8 col-md-9">
          <ChatPage />
        </div>
      </div>
      <div v-show="$q.screen.width > 599 && !usersStore.userDetails.id">
        <AuthPage />
      </div>
      <router-view class="lt-sm" v-show="$q.screen.width < 599" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useUsersStore } from "stores/users";
import { useSettingsStore } from "src/stores/settingsStore";
import { useSettingsBetweenUsers } from "src/stores/settingsBetweenUsersStore";
import Settings from "src/components/Settings";
import SettingsBetweenUsers from "src/components/SettingsBetweenUsers";
import UsersPage from "src/pages/UsersPage.vue";
import ChatPage from "src/pages/ChatPage.vue";
import AuthPage from "src/pages/AuthPage.vue";
import { computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOtherUserDetails } from "src/composables/otherUserDetails";
import { formatDistanceToNow } from "date-fns";

const usersStore = useUsersStore();
const route = useRoute();
const router = useRouter();

const settingsStore = useSettingsStore();
const settingsBetweenUsersStore = useSettingsBetweenUsers();

const { otherUserDetails } = useOtherUserDetails();
const pageTitle = computed(() => {
  if (route.path == "/") {
    return "JustChat";
  } else if (route.path.includes("/auth")) {
    return "Login";
  } else if (otherUserDetails.value) {
    return otherUserDetails.value.data.name;
  }
});

// Determines the user's online status or calculates the time since the user was last online
const lastOnline = computed(() => {
  if (otherUserDetails.value && !otherUserDetails.value.data.online) {
    return `online ${formatDistanceToNow(
      otherUserDetails.value.data.lastOnline,
      {
        addSuffix: true,
      }
    )}`;
  } else if (otherUserDetails.value && otherUserDetails.value.data.online) {
    return "online now";
  }
});

onUnmounted(() => {
  if (usersStore.userDetails.id) {
    router.push("/");
  } else if (!route.path.startsWith("/auth")) {
    router.push("/auth");
  }
});
</script>

<style lang="scss" scoped>
.text-subtitle1 {
  line-height: 0.5rem;
}

.usersPageDesktop {
  border-right: 1px solid #e6e6e6;
}
</style>