<script setup lang="ts">
import { useAccountsApi } from '@/api/accountsApi'
import { useLoading } from '@/compositions/useLoading'
import type { Account } from '@/types/Account'
import { debounce, formatDate } from '@/utils'
import { ref } from 'vue'

const accountsApi = useAccountsApi(import.meta.env.VITE_API_BASE)

const { isLoading, startLoading, stopLoading } = useLoading()

const query = ref('')
const results = ref<Account[]>([])

async function handleSearch() {
  if (query.value === '') return
  startLoading()
  results.value = await accountsApi.search(query.value)
  stopLoading()
}
</script>

<template>
  <v-container>
    <h1>Search Accounts</h1>
    <v-container class="a-DailyHomeView pa-10">
      <v-card class="mx-auto" color="surface-light" max-width="400">
        <v-card-text>
          <v-text-field
            :loading="isLoading"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Search templates"
            variant="solo"
            hide-details
            single-line
            v-model="query"
            @keyup.enter="handleSearch"
            @click:append-inner="handleSearch"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-container>

    <v-container class="a-DailyHomeView pa-10 flex">
      <v-row>
        <v-col v-for="result in results" cols="12" sm="6">
          <v-card
            :title="result.username"
            :subtitle="`Trainer-ID: ${result.trainerId}`"
            variant="flat"
            class="ma-5 float-left"
            width="100%"
          >
            <v-card-text>
              <v-row dense>
                <v-col cols="4">Banned:</v-col>
                <v-col
                  cols="8"
                  :class="{ 'text-error': result.banned, 'text-success': !result.banned }"
                >
                  {{ result.banned ? 'Yes' : 'No' }}
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="4">Discord ID:</v-col>
                <v-col cols="8" :class="{ 'text-disabled': !result.discordId }">{{
                  result.discordId ?? 'n/a'
                }}</v-col>
              </v-row>
              <v-row dense>
                <v-col cols="4">Google ID</v-col>
                <v-col cols="8" :class="{ 'text-disabled': !result.googleId }">{{
                  result.googleId ?? 'n/a'
                }}</v-col>
              </v-row>
              <v-row dense>
                <v-col cols="4">Secret ID</v-col>
                <v-col cols="8" :class="{ 'text-disabled': !result.secretId }">{{
                  result.secretId ?? 'n/a'
                }}</v-col>
              </v-row>
              <v-row dense>
                <v-col cols="4">Registered</v-col>
                <v-col cols="8">{{ formatDate(result.registered) }}</v-col>
              </v-row>
              <v-row dense>
                <v-col cols="4">Last Logged In</v-col>
                <v-col cols="8">{{ formatDate(result.lastLoggedIn) }}</v-col>
              </v-row>
              <v-row dense>
                <v-col cols="4">Last Activity</v-col>
                <v-col cols="8">{{ formatDate(result.lastActivity) }}</v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
