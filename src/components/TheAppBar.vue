<script setup lang="ts">
import { AVATAR_ICON, AUTH_COOKIE, LOGOUT_ICON, SETTINGS_ICON } from '@/constants'
import router from '@/router/router'
import { $pageTitle } from '@/stores/pageTitleStore'
import { $user } from '@/stores/userStore'
import { setCookie } from '@/utils'
import { useStore } from '@nanostores/vue'

const pageTitle = useStore($pageTitle)
const user = useStore($user)

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
      <v-menu v-if="$route.name !== 'login'">
        <template v-slot:activator="{ props }">
          <v-btn :icon="AVATAR_ICON" variant="text" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item :title="user.username" :prepend-icon="AVATAR_ICON" class="opacity-60" />
          <v-divider class="my-3"> </v-divider>
          <v-list-item title="Settings" :prepend-icon="SETTINGS_ICON" :to="{ name: 'settings' }" />
          <v-list-item title="Logout" :prepend-icon="LOGOUT_ICON" @click="handleLogout" />
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<style scoped></style>
