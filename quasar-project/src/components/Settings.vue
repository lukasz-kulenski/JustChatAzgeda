<template>
  <q-dialog
    v-model="settingsStore.showSettings"
    transition-show="slide-right"
    transition-hide="slide-left"
    transition-duration="750"
  >
    <div
      class="settings position-relative"
      :class="$q.dark.isActive ? 'bg-black' : 'bg-white'"
    >
      <q-scroll-area class="absolute full-height full-width scroll-area">
        <q-list padding>
          <q-item-label header>Profile settings</q-item-label>
          <q-separator :color="$q.dark.isActive ? 'white' : ''" />

          <q-item @click="changeSettings('username')" clickable v-ripple>
            <q-item-section>
              <q-item-label :class="$q.dark.isActive ? 'text-white' : ''"
                >Username</q-item-label
              >
              <q-item-label
                :class="$q.dark.isActive ? 'text-white' : ''"
                caption
                >Changing your display name will update how other users see and
                recognize you.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-separator :color="$q.dark.isActive ? 'white' : ''" />

          <q-item @click="changeSettings('email')" clickable v-ripple>
            <q-item-section>
              <q-item-label :class="$q.dark.isActive ? 'text-white' : ''"
                >Email</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item @click="changeSettings('password')" clickable v-ripple>
            <q-item-section>
              <q-item-label :class="$q.dark.isActive ? 'text-white' : ''"
                >Password</q-item-label
              >
              <q-item-label
                :class="$q.dark.isActive ? 'text-white' : ''"
                caption
                >Changing your password or email will require logging in with
                the updated credentials.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-separator :color="$q.dark.isActive ? 'white' : ''" />

          <q-item @click="changeSettings('avatar')" clickable v-ripple>
            <q-item-section>
              <q-item-label :class="$q.dark.isActive ? 'text-white' : ''"
                >Avatar</q-item-label
              >
              <q-item-label
                :class="$q.dark.isActive ? 'text-white' : ''"
                caption
                >Choosing an avatar will let other users see the avatar you have
                selected.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item
            @click="changeSettings('darkMode')"
            clickable
            v-ripple
            tag="label"
          >
            <q-item-section>
              <q-item-label :class="$q.dark.isActive ? 'text-white' : ''"
                >Dark Mode</q-item-label
              >
              <q-item-label
                :class="$q.dark.isActive ? 'text-white' : ''"
                caption
              >
                {{ darkMode ? "On" : "Off" }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-toggle
                @click="changeSettings('darkMode')"
                v-model="darkMode"
              />
            </q-item-section>
          </q-item>

          <q-separator :color="$q.dark.isActive ? 'white' : ''" />
          <q-item-label header>Privacy and Activity Settings</q-item-label>

          <q-item
            @click="changeSettings('activeStatus')"
            clickable
            v-ripple
            tag="label"
          >
            <q-item-section>
              <q-item-label :class="$q.dark.isActive ? 'text-white' : ''"
                >Active Status</q-item-label
              >
              <q-item-label
                :class="$q.dark.isActive ? 'text-white' : ''"
                caption
              >
                Disabling this option will prevent you from seeing other users'
                online status and other users will not be able to see your
                activity
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-toggle
                @click="changeSettings('activeStatus')"
                v-model="activeStatus"
              />
            </q-item-section>
          </q-item>

          <q-separator :color="$q.dark.isActive ? 'white' : ''" />
          <q-item-label header>Others</q-item-label>

          <q-item
            @click="UsersStore.firebaseLogoutUser"
            clickable
            v-ripple
            tag="label"
          >
            <q-item-label :class="$q.dark.isActive ? 'text-white' : ''"
              >Logout</q-item-label
            >
          </q-item>

          <q-separator :color="$q.dark.isActive ? 'white' : ''" />
        </q-list>
      </q-scroll-area>

      <q-dialog
        v-model="showChangeSettingsDialog"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Change {{ settingItem }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              v-model="settingItemContent"
              @keyup.enter="prompt = false"
              dense
              autofocus
              :type="settingItem == 'email' ? 'email' : 'text'"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              @click="changeItem"
              flat
              v-close-popup
              no-caps
              :label="`Change ${settingItem}`"
              class="text-primary"
            />
            <q-btn flat v-close-popup no-caps label="Cancel" class="text-red" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog
        v-model="showAvatarDialog"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card class="q-pa-md" flat bordered>
          <q-item class="column col">
            <q-item-section>
              <q-item-label class="text-h6 q-pb-md text-center"
                >Choose Your Avatar</q-item-label
              >
            </q-item-section>
            <q-item-section>
              <q-list class="flex flex-center">
                <q-item
                  v-for="n in 6"
                  :key="n"
                  @click="changeAvatar(n)"
                  clickable
                  v-ripple
                  v-close-popup
                  class="avatar"
                >
                  <q-avatar>
                    <img :src="`https://cdn.quasar.dev/img/avatar${n}.jpg`" />
                  </q-avatar>
                </q-item>
              </q-list>
            </q-item-section>
          </q-item>

          <q-card-actions align="right">
            <q-btn
              v-if="UsersStore.userDetails.avatar"
              @click="removeAvatar"
              flat
              v-close-popup
              no-caps
              label="Remove Avatar"
              class="text-red"
            />
            <q-btn flat v-close-popup no-caps label="Cancel" class="text-red" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useSettingsStore } from "src/stores/settingsStore";
import { useUsersStore } from "src/stores/users";

const $q = useQuasar();

const settingsStore = useSettingsStore();
const UsersStore = useUsersStore();

const showAvatarDialog = ref(false);
const showChangeSettingsDialog = ref(false);
const settingItem = ref("");
const settingItemContent = ref("");

const activeStatus = ref(settingsStore.userSettings.activeStatus);
const darkMode = ref(settingsStore.userSettings.darkMode);
const changeSettings = (value) => {
  if (value == "password" || value == "username" || value == "email") {
    showChangeSettingsDialog.value = true;
    settingItem.value = value;
  } else if (value == "avatar") {
    showAvatarDialog.value = true;
  } else if (value == "darkMode") {
    settingsStore.firebaseUpdateDarkMode(darkMode.value);
  } else if (value == "activeStatus") {
    settingsStore.firebaseUpdateActiveStatus(activeStatus.value);
  }
};

const changeItem = () => {
  const itemToChange = {
    name: settingItem.value,
    content: settingItemContent.value,
  };

  settingsStore.changeSetting(itemToChange);
  settingItemContent.value = "";
};

const changeAvatar = (value) => {
  const selectedAvatar = `https://cdn.quasar.dev/img/avatar${value}.jpg`;
  settingsStore.firebaseUpdateAvatar(selectedAvatar);
};

const removeAvatar = () => {
  settingsStore.firebaseUpdateAvatar(false);
};
</script>

<style lang="scss" scoped>
.settings {
  position: fixed;
  left: 0;
  bottom: 0;
  top: 6.1%;
  width: 50%;
  height: 100vh;
  z-index: 2;
}

.avatar {
  transition: 0.2s ease-in-out;

  &:hover {
    transform: scale(1.35);
  }
}
</style>