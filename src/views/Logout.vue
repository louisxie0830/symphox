<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../stores/useGlobalStore';

const router = useRouter();
const globalStore = useGlobalStore();


onMounted(() => {
  setTimeout(() => {
    globalStore.setAuthorizationToken('');
    globalStore.setLoggedIn(false);
    router.replace('/login');
  }, 10000);
  
});

</script>

<template>
  <div class="text-h1 text-center">logout page</div>
</template>