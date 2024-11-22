<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Map matched routes to their breadcrumb labels
const breadcrumbs = computed(() => {
  const crumbs = []

  for (const match of route.matched) {
    if (match.meta.crumb) {
      crumbs.push({
        title: String(match.meta.crumb),
        to: route.path === match.path ? undefined : { path: match.path },
        disabled: route.name === match.name ? undefined : false,
      })
    }
  }

  return crumbs
})
</script>

<template>
  <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
</template>
