<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheAppBar from '@/components/TheAppBar.vue'
</script>

<template>
  <v-app theme="dark">
    <v-main>
      <TheAppBar />
      <RouterView class="a-AppContent" />
    </v-main>
  </v-app>
</template>

<style scoped>
.a-AppContent {
  padding: 1rem;
  min-width: 100%;
  min-height: 100%;
}
</style>
