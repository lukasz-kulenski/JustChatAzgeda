<template>
  <q-page class="relative-position overflow-hidden">
    <q-input
      @keyup="searchUsers"
      rounded
      outlined
      dense
      v-model="searchUsersContent"
      class="q-ma-sm"
      label="Search"
      ref="searchUserInput"
    >
      <template v-slot:append>
        <q-icon v-if="!searchUsersContent" name="search" color="grey-6" />
        <q-btn
          v-else
          @click="clearUserSearchInput"
          flat
          dense
          rounded
          icon="close"
          color="grey-6"
        />
      </template>
    </q-input>
    <q-separator />
    <q-scroll-area class="absolute full-width full-height">
      <q-list v-if="searching" class="q-ma-xs">
        <q-item
          v-for="(user, key) in searchedUsers"
          :key="key"
          :to="`/chat/${key}`"
          clickable
          class="user-item"
        >
          <q-item-section avatar>
            <q-avatar
              v-if="!user.data.avatar"
              color="primary"
              text-color="white"
            >
              {{ user.data.name.charAt(0) }}{{ user.data.surname.charAt(0) }}
            </q-avatar>
            <q-avatar v-else>
              <img :src="`${user.data.avatar}`" />
            </q-avatar>

            <q-icon
              v-if="
                user.data.activeStatus &&
                usersStore &&
                usersStore.userDetails.activeStatus
              "
              :color="user.data.online ? 'green' : 'grey-5'"
              size="15px"
              name="circle"
              class="active-icon absolute"
              :class="
                $q.dark.isActive ? 'bg-black active-icon-dark' : 'bg-white'
              "
            />
          </q-item-section>

          <q-item-section>
            <q-item-label class="ellipsis"
              >{{ user.data.name }} {{ user.data.surname }}</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>

      <q-list class="q-ma-xs" v-if="currentMessagingUsers && !searching">
        <q-item
          v-for="(user, index) in currentMessagingUsers"
          :key="index"
          :to="`/chat/${user.chatPath}`"
          clickable
          class="user-item"
        >
          <q-item-section avatar>
            <q-avatar v-if="!user.avatar" color="primary" text-color="white">
              {{ user.name.charAt(0) }}{{ user.surname.charAt(0) }}
            </q-avatar>
            <q-avatar v-else>
              <img :src="`${user.avatar}`" />
            </q-avatar>

            <q-icon
              v-if="
                user.activeStatus &&
                usersStore &&
                usersStore.userDetails.activeStatus
              "
              :color="user.online ? 'green' : 'grey-5'"
              size="15px"
              name="circle"
              class="active-icon absolute"
              :class="
                $q.dark.isActive ? 'bg-black active-icon-dark' : 'bg-white'
              "
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="ellipsis"
              >{{ user.name }} {{ user.surname }}</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUsersStore } from "stores/users";
import { useQuasar } from "quasar";

const $q = useQuasar();

const router = useRouter();
const usersStore = useUsersStore();

// Fetches users and currently messaging users from the Firebase database,
// then sorts users based on who sent the last message
const users = ref({});
const currentUsers = ref({});
let currentMessagingUsers = ref([]);
usersStore.$subscribe((mutation, state) => {
  users.value = state.usersData;
  currentUsers.value = usersStore.currentUsers;

  currentMessagingUsers.value = Object.keys(currentUsers.value).map(
    (key) => currentUsers.value[key]
  );
  currentMessagingUsers.value.sort((a, b) => b.lastMessage - a.lastMessage);
});

// Searches for users among all chat app users based on name and surname
const searchUsersContent = ref("");
const searchedUsers = ref({});
const searching = ref(false);
const searchUsers = () => {
  searchedUsers.value = {};

  if (searchUsersContent.value.trim() != "") searching.value = true;
  else searching.value = false;

  for (let key in users.value) {
    if (
      users.value[key].data.fullname
        .toLowerCase()
        .includes(searchUsersContent.value.toLowerCase().trim()) &&
      key != usersStore.userDetails.id
    ) {
      searchedUsers.value[key] = users.value[key];
    }
  }
};

// Clear the search user input field.
const searchUserInput = ref("");
const clearUserSearchInput = () => {
  searchUsersContent.value = "";
  searchUserInput.value.focus();
  searchUsers();
};

// Hides the loading plugin, then retrieves users from the Firebase database
// and finally checks if a user is logged in,
// if not, redirects them to the login and register page
onMounted(() => {
  if (!Object.keys(usersStore.userDetails).length) {
    router.push("/auth");
  }

  $q.loading.hide();
  usersStore.firebaseGetUsers();
});
</script>

<style lang="scss" scoped>
.q-scrollarea__content {
  max-width: 100%;
}

.active-icon {
  transform: translate(155%, 80%);
  border: 2px solid white;
  border-radius: 50%;
}

.active-icon-dark {
  border: 2px solid black;
}
</style>