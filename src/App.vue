<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { RouterView } from 'vue-router'
import { $settings } from './stores/settingsStore'

const settings = useStore($settings)
</script>

<template>
  <v-app :theme="settings.theme">
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style>
html,
body {
  background: #000000;
}
</style>
