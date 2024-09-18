import { defineStore } from 'pinia'
import { ref } from 'vue';


export const useGlobalStore = defineStore('global', () => {
  const authorizationToken = ref(sessionStorage.getItem('authorizationToken') ?? '');
  const isLoggedIn = ref(sessionStorage.getItem('isLoggedIn') ?? false);
  
  const setAuthorizationToken = (token) => {
    authorizationToken.value = token;
    sessionStorage.setItem('authorizationToken', authorizationToken.value);
  };
  
  const setLoggedIn = (status) => {
    isLoggedIn.value = status;
    sessionStorage.setItem('isLoggedIn', isLoggedIn.value);
  };

  return {
    isLoggedIn,
    authorizationToken,
    setAuthorizationToken,
    setLoggedIn
  }
});