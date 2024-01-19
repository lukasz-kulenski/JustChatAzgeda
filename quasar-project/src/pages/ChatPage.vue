<template>
  <q-page class="chat-page flex column relative-position">
    <template v-if="route.path.includes('/chat')">
      <q-scroll-area
        :thumb-style="thumbStyle"
        :bar-style="barStyle"
        class="absolute full-width full-height chat-page-scroll-bar"
        ref="scrollArea"
      >
        <div
          class="chat-page-messages"
          :class="settingsBetweenUsersStore.selectedTheme"
        >
          <div
            v-if="showMessages && !visible && messagesStore"
            class="q-px-md q-pt-md q-pb-sm column col justify-end chat-page-messages-content"
            :class="!isTyping ? 'isNotTyping' : ''"
          >
            <div v-for="(message, key) in messages" :key="key">
              <q-chat-message
                v-if="showMessageLabel(message.date)"
                :label="messageLabel(message.date)"
                dense
                class="chat-message"
                :class="
                  settingsBetweenUsersStore.selectedTheme == 'bricks-theme' ||
                  settingsBetweenUsersStore.selectedTheme == 'geometric-figures'
                    ? 'chat-message-label-white'
                    : 'chat-message-label-grey'
                "
              />

              <q-chat-message
                :text="[message.text]"
                :sent="message.from == 'me' ? true : false"
                :bg-color="message.from == 'me' ? 'blue' : 'grey'"
                text-color="white"
                :stamp="formattedDate(message.date)"
                class="chat-message-label"
              >
                <template v-slot:avatar>
                  <q-avatar
                    size="lg"
                    :class="message.from == 'me' ? 'q-ml-xs' : 'q-mr-xs'"
                  >
                    <img
                      v-if="messageAvatar(message.from)"
                      :src="`${messageAvatar(message.from)}`"
                    />
                    <q-icon v-else size="xl" class="bg-grey" name="person" />
                  </q-avatar>
                </template>
              </q-chat-message>
            </div>
            <q-chat-message
              v-if="messagesStore && isTyping"
              bg-color="grey"
              text-color="white"
              class="spinner-dots"
            >
              <q-spinner-dots size="2rem" />
            </q-chat-message>
          </div>
        </div>
      </q-scroll-area>
      <q-inner-loading class="flex center" :showing="visible">
        <q-spinner color="primary" size="3em" />
      </q-inner-loading>
      <div bordered class="footer q-pa-sm bg-primary">
        <q-form autofocus @submit="sendMessage">
          <q-input
            dense
            rounded
            outlined
            v-model="messageContent"
            :color="$q.dark.isActive ? 'white' : 'black'"
            :bg-color="$q.dark.isActive ? 'black' : 'white'"
            label="Message"
            class="chat-input"
            ref="messageInput"
          >
            <template v-slot:append>
              <q-btn
                @click="sendMessage"
                flat
                rounded
                dense
                icon="send"
                type="submit"
                color="grey-6"
              />
            </template>
          </q-input>
        </q-form>
      </div>
    </template>
    <template v-else>
      <div class="no-chat-selected flex flex-center">
        <h4 class="text-bold">Select a chat</h4>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useMessagesStore } from "stores/messages";
import { useUsersStore } from "stores/users";
import { useSettingsBetweenUsers } from "src/stores/settingsBetweenUsersStore";
import { useRoute, useRouter } from "vue-router";
import { date } from "quasar";

const route = useRoute();
const router = useRouter();

const messagesStore = useMessagesStore();
const usersStore = useUsersStore();
const settingsBetweenUsersStore = useSettingsBetweenUsers();

const messages = ref({});

// Observing new messages and 'isTyping' status changes.
// Automatically scrolling to the bottom to show recent messages
const showMessages = ref(false);
const visible = ref(true);
const isTyping = computed(() => {
  return messagesStore.messagesInfo.isTyping;
});
watch(
  [messages, isTyping],
  ([messagesNewVal, isTypingNewVal]) => {
    if (Object.keys(messagesNewVal).length || isTypingNewVal) {
      scrollToBottom();
      setTimeout(() => {
        showMessages.value = true;
        visible.value = false;
      }, 300);
    }
  },
  { deep: true }
);

// Scroll bar styles
const thumbStyle = {
  right: "2px",
  borderRadius: "5px",
  backgroundColor: "#177714",
  width: "5px",
  opacity: 0.75,
  "z-index": 22,
};

const barStyle = {
  right: "1px",
  borderRadius: "9px",
  backgroundColor: "#177714",
  width: "9px",
  opacity: 0.2,
  "z-index": 22,
};

//Scroll page to the bottom (shows the newest messages)
const scrollArea = ref(null);
const scrollToBottom = () => {
  if (scrollArea.value) {
    setTimeout(() => {
      scrollArea.value.setScrollPercentage("vertical", 1);
    }, 350);
  }
};

// Sending a user's message to the Firebase database
const messageInput = ref(null);
const messageContent = ref("");
const sendMessage = () => {
  if (!visible.value) {
    messagesStore.firebaseSendMessage({
      message: {
        from: "me",
        text: messageContent.value.trim(),
        date: Date.now(),
      },
      myId: usersStore.userDetails.id,
      otherUserId: usersStore.usersData[route.params.otherUserId].id,
    });
    messageContent.value = "";
    messageInput.value.focus();
    usersStore.firebaseGetUsers();
  }
};

// Watching the 'messageContent' variable and displaying spinner dots
// based on whether the other user is typing or not
const updateTyping = (update) => {
  const payLoad = {
    myId: usersStore.userDetails.id,
    otherUserId: usersStore.usersData[route.params.otherUserId].id,
    updates: {
      isTyping: update,
    },
  };
  messagesStore.firebaseUpdateTyping(payLoad);
};
watch(messageContent, (newValue) => {
  if (newValue.trim()) {
    updateTyping(true);
  } else {
    updateTyping(false);
  }
});

// Takes messages from the pinia store
messagesStore.$subscribe((mutation, state) => {
  messages.value = state.messages;
});

// Retrieving the chat messages exchanged between the logged-in user
// and the currently selected user,
// and fetching their conversation history
const getMessages = () => {
  if (route.path.includes("/chat/")) {
    const getMessagesDetails = {
      myId: usersStore.userDetails.id,
      otherUserId: usersStore.usersData[route.params.otherUserId].id,
    };
    messagesStore.firebaseGetMessages(getMessagesDetails);
  }

  setTimeout(() => {
    visible.value = false;
  }, 5000);
};

// Formatting the date and displaying the time when a user sent a message
const formattedDate = (dateToFormat) => {
  return date.formatDate(dateToFormat, "h:mm A");
};

onMounted(() => {
  setTimeout(() => {
    getMessages();
    settingsBetweenUsersStore.firebaseGetTheme();
  }, 500);
});

// Observing path changes (user selection) and updating messages
// Also tracking 'isTyping' status after each path change
const chatPath = computed(() => {
  if (route.params.otherUserId != undefined) return route.params.otherUserId;
});
watch(chatPath, () => {
  if (chatPath.value != undefined) {
    messagesStore.firebaseClearMessages();
    getMessages();
    settingsBetweenUsersStore.selectedTheme = "";
    visible.value = true;

    const payLoad = {
      myId: usersStore.userDetails.id,
      otherUserId: usersStore.usersData[route.params.otherUserId].id,
    };
    messagesStore.firebaseGetUpdateTyping(payLoad);
  }
});

onUnmounted(() => {
  messagesStore.firebaseClearMessages();
  settingsBetweenUsersStore.selectedTheme = "";
  router.push("/auth");
});

// Checking if a message label should be show based on day
let lastRecordedDate;
const showMessageLabel = (timestamp) => {
  const date = new Date(timestamp);
  const areDatesEqual = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  if (!lastRecordedDate || !areDatesEqual(date, lastRecordedDate)) {
    lastRecordedDate = date;
    return true;
  } else {
    return false;
  }
};

// Creating a label in q-chat-message component
const messageLabel = (timestamp) => {
  const options = { weekday: "long", day: "numeric" };
  const date = new Date(timestamp);
  const getSuffix = (day) => {
    switch (day) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const suffix = getSuffix(date.getDate());

  return `${date.toLocaleDateString("en-UK", options)}${suffix}`;
};

// Display an avatar on the chat page. If the user hasn't selected their avatar,
// the default avatar will be displayed.
const messageAvatar = (messageFrom) => {
  if (messageFrom == "me" && usersStore.userDetails.avatar) {
    return usersStore.userDetails.avatar;
  } else if (
    messageFrom != "me" &&
    usersStore.usersData[route.params.otherUserId].data.avatar
  ) {
    return usersStore.usersData[route.params.otherUserId].data.avatar;
  } else {
    return false;
  }
};
</script>

<style lang="scss" scoped>
.chat-page {
  .chat-page-messages,
  .no-chat-selected {
    div {
      z-index: 2;
    }

    .q-message-stamp {
      opacity: 0.75;
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    z-index: 3;

    @media (min-width: $breakpoint-sm-min) {
      width: 66.66%;
    }

    @media (min-width: $breakpoint-md-min) {
      width: 75%;
    }
  }

  .spinner-dots,
  .isNotTyping {
    margin-bottom: 60px;
  }

  // .chat-input {
  //   color: black;
  // }

  .chat-page-scroll-bar {
    z-index: 2;
  }

  .chat-page-messages {
    .chat-page-messages-content {
      .chat-message-label-white {
        color: white;
      }
      .chat-message-label-grey {
        color: $grey-7;
      }
      .chat-message {
        font-size: 16px;
      }
    }
  }

  // .chat-input .q-field--dark .q-field__native {
  // color: red !important;
  // }
}
</style>