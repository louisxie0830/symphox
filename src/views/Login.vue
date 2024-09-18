<script setup>
import { inject, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength } from '@vuelidate/validators'
import { useGlobalStore } from '../stores/useGlobalStore';

const globalStore = useGlobalStore();
const fetch = inject('fetch');
const router = useRouter();

const initialState = {
  username: 'testuser',
  password: 'ShowMeTheMoney'
};

const state = reactive({
  ...initialState,
});

const rules = {
  username: {
    required,
    maxLength: maxLength(32)
  },
  password: {
    required,
    maxLength: maxLength(64)
  }
};

const v$ = useVuelidate(rules, state);


const login = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  try {
    const res = await fetch('/login', {
      method: 'POST',
      body: JSON.stringify({
        username: state.username,
        password: state.password
      })
    })
    if (res?.token) {
      globalStore.setLoggedIn(true);
      globalStore.setAuthorizationToken(res.token);
      router.push('/products');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

</script>

<template>
  <v-sheet
    class="pa-12"
    rounded
  >
    <v-card class="mx-auto" max-width="400">
      <template v-slot:title>
        <span class="font-weight-black"> 
          <v-card-title class="text-h5">登入</v-card-title>
        </span>
      </template>
      <v-card-text>
        <form>
          <v-text-field
            v-model="state.username"
            :error-messages="v$.username.$errors.map(e => e.$message)"
            label="帳號"
            required
            @blur="v$.username.$touch"
            @input="v$.username.$touch"
            clearable
            variant="underlined"
          ></v-text-field>

          <v-text-field
            v-model="state.password"
            :error-messages="v$.password.$errors.map(e => e.$message)"
            label="密碼"
            type="password"
            required
            @blur="v$.password.$touch"
            @input="v$.password.$touch"
            clearable
            variant="underlined"
          ></v-text-field>

          <br />

          <v-btn
            class="me-4 bg-primary"
            block
            @click.prevent="login"
          >
            登入
          </v-btn>
        </form>
      </v-card-text>
    </v-card>
  </v-sheet>

</template>
