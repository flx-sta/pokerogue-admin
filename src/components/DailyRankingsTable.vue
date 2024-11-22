<script setup lang="ts">
import { useDailyRunsApi } from '@/api/dailyRunsApi'
import { DELETE_ICON, RESTORE_ICON } from '@/constants'
import type { DailyRun, DailyRunWithId } from '@/types/DailyRun'
import { computed, reactive, ref } from 'vue'
import type { VDataTable } from 'vuetify/components'
import ConfirmDialog from './ConfirmDialog.vue'

const dailyRunsApi = useDailyRunsApi(import.meta.env.VITE_API_BASE)

const loading = reactive({
  table: false,
  item: false,
})
const page = ref(1)
const itemsPerPage = ref(10)
const expandedRows = ref<string[]>([])
const headers: VDataTable['$props']['headers'] = [
  { title: 'Username', key: 'username', sortable: true },
  { title: 'Date', key: 'date', sortable: true },
  { title: 'Score', key: 'score', sortable: true },
  { title: 'Wave', key: 'wave', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]
const computedItemsPerPageOptions = computed(() => [
  10,
  ...[25, 50, 100].filter((i) => i <= totalCount.value),
])
const runs = ref<DailyRunWithId[]>([])
const totalCount = ref(-1)
const runToDelete = ref<DailyRun | null>(null)
const runToRestore = ref<DailyRun | null>(null)
const showConfirmDialog = computed(() => runToDelete.value !== null || runToRestore.value !== null)
const confirmDialogTitle = ref()
const confirmDialogText = ref()

async function loadRuns(limit: number, page: number) {
  loading.table = true
  const { total, data } = await dailyRunsApi.getDailyRuns(limit, page)
  setTimeout(() => {
    runs.value = data.map((d) => ({ ...d, id: `${d.username}-${d.date}` }))
    totalCount.value = total
    loading.table = false
  }, 2000)
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

  loading.item = true
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

  loading.item = false
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

  loading.item = true
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

  loading.item = false
}

function handlePageChange(nextPage: number) {
  page.value = nextPage
  loadRuns(itemsPerPage.value, nextPage)
}

function handleItemsPerPageUpdate(nextItemsPerPage: number) {
  itemsPerPage.value = nextItemsPerPage
  page.value = 1
  loadRuns(nextItemsPerPage, 1)
}

// INIT

loadRuns(10, 1)
</script>

<template>
  <v-data-table
    v-model:expanded="expandedRows"
    :headers="headers"
    :items="runs"
    :page="page"
    :items-per-page="itemsPerPage"
    :items-per-page-options="computedItemsPerPageOptions"
    :loading="loading.table"
    :cell-props="
      (cell) =>
        cell.item.deleted && headers.some((h) => h.key === cell.column.key)
          ? { class: 'text-error' }
          : {}
    "
    show-expand
    @update:page="handlePageChange"
    @update:items-per-page="handleItemsPerPageUpdate"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Daily Runs</v-toolbar-title>
      </v-toolbar>
    </template>
    <template v-slot:expanded-row="{ columns, item }" class="p-20">
      <tr>
        <td :colspan="columns.length - 1">
          <v-container class="ml-16">
            <template v-if="item.deleted">
              <v-row>
                <v-col :cols="3">Deleted by (Discord ID):</v-col>
                <v-col :cols="5">{{ item.deletedByDiscordId }}</v-col>
              </v-row>
              <v-row>
                <v-col :cols="3">Deleted at:</v-col>
                <v-col :cols="5">{{ item.deletedAt }}</v-col>
              </v-row>
            </template>
            <template v-else> No Details available </template>
          </v-container>
        </td>
      </tr>
      <!-- <tr class="p-20">
        <td></td>
        <td>Deleted aAt</td>
        <td>{{ item.deletedAt }}</td>
      </tr>
      <tr class="px-20">
        <td :colspan="columns.length / 2">Deleted by (Discord ID)</td>
        <td :colspan="columns.length / 2">{{ item.deletedByDiscordId }}</td>
      </tr> -->
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn-group>
        <v-btn
          v-if="!item.deleted"
          :icon="DELETE_ICON"
          color="error"
          variant="plain"
          title="Delete"
          @click="handleDeleteRequest(item)"
        ></v-btn>
        <v-btn
          v-if="item.deleted"
          :icon="RESTORE_ICON"
          color="primary"
          variant="plain"
          title="Restore"
          @click="handleRestoreRequest(item)"
        ></v-btn>
      </v-btn-group>
    </template>
    <template v-slot:loading>
      <v-skeleton-loader :type="`table-row@${itemsPerPage}`"></v-skeleton-loader>
    </template>
    <template v-slot:no-data> No data available </template>
  </v-data-table>

  <!-- Dialogs -->
  <ConfirmDialog
    :title="confirmDialogTitle"
    :text="confirmDialogText"
    v-model="showConfirmDialog"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>
