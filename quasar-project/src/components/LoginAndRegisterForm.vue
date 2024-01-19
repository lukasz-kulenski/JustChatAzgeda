<template>
  <div class="q-pa-md">
    <q-form @submit="submitForm" autofocus class="q-gutter-md">
      <q-input
        v-if="props.tab == 'Register'"
        dense
        :rules="[(val) => (val && val.length > 0) || 'Fill in the field']"
        lazy-rules
        outlined
        v-model="formData.name"
        autocomplete
        type="text"
        label="Name *"
      />

      <q-input
        v-if="props.tab == 'Register'"
        dense
        :rules="[(val) => (val && val.length > 0) || 'Fill in the field']"
        lazy-rules
        outlined
        v-model="formData.surname"
        autocomplete
        type="text"
        label="Surname *"
      />

      <q-input
        dense
        :rules="[(val) => (val && val.length > 0) || 'Fill in the field']"
        lazy-rules
        outlined
        v-model="formData.email"
        autocomplete
        type="email"
        label="Email *"
      />

      <q-input
        dense
        :rules="[(val) => (val && val.length > 0) || 'Fill in the field']"
        lazy-rules
        outlined
        v-model="formData.password"
        autocomplete
        :type="showPassword ? 'password' : 'text'"
        label="Password *"
      >
        <template v-slot:append>
          <q-icon
            @click="showPassword = !showPassword"
            :name="showPassword ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
          />
        </template>
      </q-input>

      <div class="row justify-center">
        <q-btn
          @click.prevent="submitForm"
          no-caps
          :label="props.tab"
          type="submit"
          color="primary"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { useUsersStore } from "stores/users";
import { useQuasar } from "quasar";

const $q = useQuasar();

const showPassword = ref(true);

const store = useUsersStore();

const props = defineProps({
  tab: String,
});

const formData = ref({
  name: "adam",
  surname: "",
  email: "adam@op.pl",
  password: "adam123",
});

const submitForm = () => {
  if (props.tab == "Login") {
    store.firebaseLoginUser(formData.value, $q);
  } else {
    store.firebaseRegisterUser(formData.value, $q);
  }
};
</script>