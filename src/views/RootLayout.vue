<script setup lang="ts">
import TheAppBar from '@/components/TheAppBar.vue'
import TheBreadcrumbs from '@/components/TheBreadcrumbs.vue'
</script>

<template>
  <TheAppBar />
  <TheBreadcrumbs />
  <RouterView class="px-4" />
</template>
