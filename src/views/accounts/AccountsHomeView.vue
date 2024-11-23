<script setup lang="ts"></script>

<template>
  <div class="a-DailyHomeView">
    <v-card
      title="Search Accounts"
      subtitle="Search them all!"
      :to="{ name: 'accounts.search' }"
      variant="elevated"
      class="mx-auto"
      max-width="344"
    />
  </div>
</template>
