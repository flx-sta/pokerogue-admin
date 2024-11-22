<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { $title } from '@/stores/titleStore'
import { setCookie } from '@/utils'
import { AUTH_COOKIE } from '@/constants'
import router from '@/router'

const pageTitle = useStore($title)

function handleLogout() {
  setCookie(AUTH_COOKIE, '')
  router.push('/login')
}
</script>

<template>
  <v-app-bar :elevation="2">
    <template v-slot:prepend>
      <v-app-bar-nav-icon disabled></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>{{ pageTitle }}</v-app-bar-title>

    <template v-slot:append>
      <v-btn icon="mdi-magnify" disabled></v-btn>
      <v-btn v-if="$route.name !== 'login'" icon="mdi-logout" @click="handleLogout"></v-btn>
    </template>
  </v-app-bar>
</template>

<style scoped></style>
