<script setup lang="ts"></script>

<template>
  <main class="a-HomeView">
    <v-row dense>
      <v-col cols="12" md="6">
        <v-card
          title="Manage Daily Runs"
          subtitle="Manage them all!"
          :to="{ name: 'daily.runs' }"
          variant="elevated"
          class="mx-auto"
          max-width="344"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-card
          title="Search Accounts"
          subtitle="Search them all!"
          :to="{ name: 'accounts.search' }"
          variant="elevated"
          class="mx-auto"
          max-width="344"
        />
      </v-col>
    </v-row>
  </main>
</template>
