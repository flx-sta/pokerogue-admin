<script setup lang="ts">
import type { LoginResponse } from 'src/types/LoginResponse'
import { ref } from 'vue'
import router from '@/router'
import { setCookie } from '@/utils'
import { AUTH_COOKIE } from '@/constants'

const showDialog = ref(true)
const hidePassword = ref(true)
const loginFailed = ref(false)
const username = ref('')
const password = ref('')

const handleLogin = async () => {
  const formData = new URLSearchParams({
    username: username.value,
    password: password.value,
  })

  try {
    const response = await fetch('http://localhost:8001/account/login', {
      method: 'POST',
      body: formData.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if (response.ok) {
      const resData: LoginResponse = await response.json()

      if (resData.token) {
        showDialog.value = false
        username.value = ''
        setCookie(AUTH_COOKIE, resData.token)
        router.push('/')
      }
    } else {
      console.warn('Failed to login', response)
      loginFailed.value = true
    }
  } catch (err) {
    console.error('Error logging in:', err)
  } finally {
    password.value = ''
  }
}
</script>

<template>
  <v-dialog v-model="showDialog" persistent width="auto">
    <v-img
      class="mx-auto my-6"
      max-width="228"
      src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
    ></v-img>

    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
        v-model="username"
        density="compact"
        placeholder="Username"
        prepend-inner-icon="mdi-account-outline"
        variant="outlined"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password
      </div>

      <v-text-field
        v-model="password"
        :append-inner-icon="hidePassword ? 'mdi-eye-off' : 'mdi-eye'"
        :type="hidePassword ? 'password' : 'text'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="hidePassword = !hidePassword"
      ></v-text-field>

      <v-alert type="warning" class="mb-8">
        <strong>This platform is only for administrators!</strong><br />
        If you still decide to try logging in as a normal user, the administrators will be notified
        of your attempt and approrpriate action will be taken.<br />
        <strong>Consider yourself warned!</strong>
      </v-alert>
      <v-btn class="mb-1" color="blue" size="large" variant="tonal" block @click="handleLogin">
        Log In
      </v-btn>
      <v-alert v-if="loginFailed" type="error"> Check your credentials and try again. </v-alert>
    </v-card>
  </v-dialog>
</template>
