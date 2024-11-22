<script setup lang="ts">
import { useDailyRunsApi } from '@/api/dailyRunsApi'
import { DELETE_ICON, DELETE_RESTORE_ICON } from '@/constants'
import type { DailyRun } from '@/types/DailyRun'
import { computed, ref } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'

const dailyRunsApi = useDailyRunsApi(import.meta.env.VITE_API_BASE)

const loading = ref(false)
const headers: string[] = ['Username', 'Date', 'Score', 'Wave', 'Actions']
const runs = ref<DailyRun[]>([])
const totalCount = ref(-1)
const runToDelete = ref<DailyRun | null>(null)
const runToRestore = ref<DailyRun | null>(null)
const showConfirmDialog = computed(() => runToDelete.value !== null || runToRestore.value !== null)
const confirmDialogTitle = ref()
const confirmDialogText = ref()

async function loadRuns(limit: number, page: number) {
  loading.value = true
  const { total, data } = await dailyRunsApi.getDailyRuns(limit, page)
  runs.value = data
  totalCount.value = total
  loading.value = false
}

function handleConfirm() {
  if (runToDelete.value) {
    handleConfirmDelete()
  } else if (runToRestore.value) {
    handleConfirmRestore()
  }
}

function handleCancel() {
  runToDelete.value = null
  runToRestore.value = null
}

function handleDeleteRequest(run: DailyRun) {
  runToDelete.value = run
  confirmDialogTitle.value = `Delete run?`
  confirmDialogText.value = `Are you sure you want to delete run for ${run.username} on ${run.date}?`
}

async function handleConfirmDelete() {
  if (!runToDelete.value) {
    console.warn('No run to delete buffered!')
    return
  }

  loading.value = true
  const success = await dailyRunsApi.softDeleteDailyRun(
    runToDelete.value.username,
    runToDelete.value.date,
  )

  if (success) {
    runs.value = runs.value.map((r) => ({
      ...r,
      deleted:
        r.username === runToDelete.value!.username && r.date === runToDelete.value!.date
          ? true
          : r.deleted,
    }))
    runToDelete.value = null
  }

  loading.value = false
}

function handleRestoreRequest(run: DailyRun) {
  confirmDialogTitle.value = `Restore run for ${run.username} on ${run.date}?`
  confirmDialogText.value = `Are you sure you want to restore run for ${run.username} on ${run.date}?`
  runToRestore.value = run
}

async function handleConfirmRestore() {
  if (!runToRestore.value) {
    console.warn('No run to restore buffered!')
    return
  }

  loading.value = true
  const success = await dailyRunsApi.restoreDeletedDailyRun(
    runToRestore.value.username,
    runToRestore.value.date,
  )

  if (success) {
    runs.value = runs.value.map((r) => ({
      ...r,
      deleted:
        r.username === runToRestore.value!.username && r.date === runToRestore.value!.date
          ? false
          : r.deleted,
    }))
    runToRestore.value = null
  }

  loading.value = false
}

// INIT

loadRuns(10, 1)
</script>

<template>
  <v-table density="compact">
    <thead>
      <tr>
        <th v-for="header in headers" :key="header" class="text-left">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="run in runs" :key="`${run.username}_${run.date}`">
        <td :class="{ 'opacity-20': run.deleted }">{{ run.username }}</td>
        <td :class="{ 'opacity-20': run.deleted }">{{ run.date }}</td>
        <td :class="{ 'opacity-20': run.deleted }">{{ run.score }}</td>
        <td :class="{ 'opacity-20': run.deleted }">{{ run.wave }}</td>
        <td>
          <v-btn-group>
            <v-btn
              :icon="!run.deleted ? DELETE_ICON : DELETE_RESTORE_ICON"
              :color="run.deleted ? 'primary' : 'error'"
              variant="plain"
              :title="!run.deleted ? 'Delete' : 'Restore'"
              @click="run.deleted ? handleRestoreRequest(run) : handleDeleteRequest(run)"
            ></v-btn>
          </v-btn-group>
        </td>
      </tr>

      <template v-if="loading">
        <tr v-for="n in 10" :key="n">
          <td v-for="(_, i) in headers" :key="i">
            <v-skeleton-loader type="text"></v-skeleton-loader>
          </td>
        </tr>
      </template>

      <tr v-if="!loading && runs.length === 0">
        <td :colspan="headers.length">No entries found</td>
      </tr>
    </tbody>
  </v-table>

  <!-- Dialogs -->
  <ConfirmDialog
    :title="confirmDialogTitle"
    :text="confirmDialogText"
    v-model="showConfirmDialog"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />

  <div class="mt-4 text-right" v-if="totalCount >= 0">Total: {{ totalCount }}</div>
</template>
