<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useGlobalStore } from './stores/useGlobalStore';

const router = useRouter();
const globalStore = useGlobalStore();
const theme = ref('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
};

const logout = () => {
  globalStore.setAuthorizationToken('');
  globalStore.setLoggedIn(false);
  router.replace('/login');
};

</script>

<template>
  <v-responsive class="mx-auto">
    <v-app :theme="theme">
      <v-app-bar class="px-3">
        <v-spacer></v-spacer>
        <v-btn :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" text="Toggle Theme" slim @click="toggleTheme" />
        <v-btn v-if="globalStore.isLoggedIn" text="Logout" slim @click="logout" />
      </v-app-bar>
      <v-main class="d-flex align-center justify-center">
        <v-container>
          <RouterView />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
