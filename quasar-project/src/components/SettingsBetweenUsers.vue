<template>
  <q-dialog
    v-model="settingsBetweenUsersStore.showSettingsBetweenUsers"
    transition-show="slide-left"
    transition-hide="slide-right"
    transition-duration="750"
  >
    <div
      class="settings-between-users"
      :class="$q.dark.isActive ? 'bg-black' : 'bg-white'"
    >
      <div class="position-relative">
        <q-scroll-area
          class="absolute full-height full-width"
          :class="$q.dark.isActive ? 'text-white' : 'text-black'"
        >
          <q-list padding>
            <q-item-label header>Customization</q-item-label>
            <q-separator :color="$q.dark.isActive ? 'white' : ''" />

            <q-item @click="showChangeThemeDialog = true" clickable v-ripple>
              <q-item-section>
                <q-item-label>Theme</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator :color="$q.dark.isActive ? 'white' : ''" />

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Nicknames</q-item-label>
              </q-item-section>
              <q-separator />
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-dialog
          v-model="showChangeThemeDialog"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6 text-center">Change Theme</div>
            </q-card-section>

            <q-card-section>
              <q-list bordered separator>
                <q-item
                  v-for="theme in themes"
                  :key="theme"
                  @click="themePreview(theme)"
                  clickable
                  v-ripple
                >
                  <p>{{ theme.name }}</p>
                </q-item>
              </q-list>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                flat
                v-close-popup
                label="Cancel"
                class="text-white bg-red-5"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog
          v-model="showThemeDialog"
          full-width
          full-height
          transition-show="scale"
          transition-hide="scale"
        >
          <q-card
            flat
            bordered
            class="column col justify-between"
            :class="selectedTheme == 'town' ? 'town-preview' : selectedTheme"
          >
            <q-card-section>
              <div class="row justify-center">
                <div class="q-pt-xs full-width">
                  <q-chat-message
                    sent
                    avatar="https://cdn.quasar.dev/img/avatar4.jpg"
                    :text="['hey, how are you?']"
                    stamp="4:06 PM"
                  />
                  <q-chat-message
                    avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                    :text="[`doing fine, how r you?`]"
                    stamp="4:07 PM"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                @click="selectTheme"
                flat
                no-caps
                v-close-popup
                :label="`Select Theme`"
                class="text-white bg-green-5"
              />
              <q-btn
                flat
                no-caps
                v-close-popup
                label="Cancel"
                class="text-white bg-red-5"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </q-dialog>
</template>
  
  <script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useSettingsBetweenUsers } from "src/stores/settingsBetweenUsersStore";

const $q = useQuasar();

const settingsBetweenUsersStore = useSettingsBetweenUsers();

const showChangeThemeDialog = ref(false);
const showThemeDialog = ref(false);

const themes = ref([
  {
    name: "Bricks",
    theme: "bricks-theme",
  },
  {
    name: "Christmas",
    theme: "christmas-theme",
  },
  {
    name: "Overlapping Cubes",
    theme: "overlapping-cubes",
  },
  {
    name: "Geometric Figures",
    theme: "geometric-figures",
  },
  {
    name: "Town",
    theme: "town",
  },
]);

const selectedTheme = ref("");
const themePreview = (theme) => {
  selectedTheme.value = theme.theme;
  showThemeDialog.value = true;
};

const selectTheme = () => {
  settingsBetweenUsersStore.firebaseChangeTheme(selectedTheme.value);
};
</script>
  
<style lang="scss" scoped>
.settings-between-users {
  position: fixed;
  right: 0;
  bottom: 0;
  top: 6.2%;
  width: 50%;
  height: 100vh;
  // background: black;
  z-index: 2;
}

.q-message,
.q-btn {
  position: relative;
  z-index: 2;
}
</style>