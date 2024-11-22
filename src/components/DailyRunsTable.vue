<script setup lang="ts">
import { useDailyRunsApi } from '@/api/dailyRunsApi'
import { DELETE_ICON, RESTORE_ICON } from '@/constants'
import type { DailyRun, DailyRunWithId } from '@/types/DailyRun'
import { formatDate, formatNumber } from '@/utils'
import { computed, reactive, ref } from 'vue'
import type { VDataTable } from 'vuetify/components'
import ConfirmDialog from './ConfirmDialog.vue'

const dailyRunsApi = useDailyRunsApi(import.meta.env.VITE_API_BASE)

const loadingDelay = 250
const loading = reactive({
  status: false,
  timeout: -1,
})
const page = ref(1)
const itemsPerPage = ref(10)
const expandedRows = ref<string[]>([])
const headers: VDataTable['$props']['headers'] = [
  { title: 'Username', key: 'username', sortable: true },
  { title: 'Date', key: 'date', sortable: true },
  { title: 'Score', key: 'score', sortable: true },
  { title: 'Wave', key: 'wave', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]
const computedItemsPerPageOptions = computed(() => [
  10,
  ...[25, 50, 100].filter((i) => i <= itemsLength.value),
])
const items = ref<DailyRunWithId[]>([])
const itemsLength = ref(-1)
const itemTo = reactive<{ delete: DailyRun | null; restore: DailyRun | null }>({
  delete: null,
  restore: null,
})
const confirmDialog = reactive({
  title: '',
  text: '',
})
const showConfirmDialog = computed(() => itemTo.delete !== null || itemTo.restore !== null)

function startLoading() {
  console.log('startLoading', loading.timeout, loading.status)
  loading.timeout = setTimeout(() => (loading.status = true), loadingDelay)
}

function endLoading() {
  console.log('endLoading', loading.timeout, loading.status)
  if (loading.timeout !== -1) {
    clearTimeout(loading.timeout)
  }

  loading.status = false
}

async function loadItems(limit: number, page: number) {
  startLoading()
  const { total, data } = await dailyRunsApi.getDailyRuns(limit, page)
  items.value = data.map((d) => ({ ...d, id: `${d.username}-${d.date}` }))
  if (items.value.length < itemsPerPage.value) {
    items.value = [
      ...items.value,
      ...Array.from({ length: itemsPerPage.value - items.value.length }).map(
        (r) => ({}) as unknown as DailyRunWithId,
      ),
    ]
  }
  itemsLength.value = total
  endLoading()
}

function handleConfirm() {
  if (itemTo.delete) {
    handleConfirmDelete()
  } else if (itemTo.restore) {
    handleConfirmRestore()
  }
}

function handleCancel() {
  itemTo.delete = null
  itemTo.restore = null
}

function handleDeleteRequest(run: DailyRun) {
  itemTo.delete = run
  confirmDialog.title = `Delete run?`
  confirmDialog.text = `Are you sure you want to delete the run\nfor ${run.username} on ${run.date}?`
}

async function handleConfirmDelete() {
  if (!itemTo.delete) {
    console.warn('No run to delete buffered!')
    return
  }

  const success = await dailyRunsApi.softDeleteDailyRun(itemTo.delete.username, itemTo.delete.date)

  if (success) {
    items.value = items.value.map((r) => {
      const isUpdatedItem = r.username === itemTo.delete!.username && r.date === itemTo.delete!.date
      return {
        ...r,
        deleted: isUpdatedItem ? true : r.deleted,
        deletedAt: isUpdatedItem ? new Date().toISOString() : r.deletedAt,
        deletedByDiscordId: isUpdatedItem ? '@me' : r.deletedByDiscordId,
      }
    })
    itemTo.delete = null
  }
}

function handleRestoreRequest(run: DailyRun) {
  confirmDialog.title = `Restore run for ${run.username} on ${run.date}?`
  confirmDialog.text = `Are you sure you want to restore<br>run for ${run.username} on ${run.date}?`
  itemTo.restore = run
}

async function handleConfirmRestore() {
  if (!itemTo.restore) {
    console.warn('No run to restore buffered!')
    return
  }

  const success = await dailyRunsApi.restoreDeletedDailyRun(
    itemTo.restore.username,
    itemTo.restore.date,
  )

  if (success) {
    items.value = items.value.map((r) => ({
      ...r,
      deleted:
        r.username === itemTo.restore!.username && r.date === itemTo.restore!.date
          ? false
          : r.deleted,
    }))
    itemTo.restore = null
  }
}

// INIT
</script>

<template>
  <v-data-table-server
    v-model:expanded="expandedRows"
    v-model:page="page"
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="items"
    :items-length="itemsLength"
    :loading="loading.status"
    :items-per-page-options="computedItemsPerPageOptions"
    :cell-props="
      (cell) =>
        cell.item.deleted && headers.some((h) => h.key === cell.column.key)
          ? { class: 'text-error' }
          : {}
    "
    @update:options="loadItems(itemsPerPage, page)"
    show-expand
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Daily Runs</v-toolbar-title>
      </v-toolbar>
    </template>
    <template #item.date="{ value }">
      {{ value && formatDate(value) }}
    </template>
    <template #item.score="{ value }">
      {{ value && formatNumber(value) }}
    </template>
    <template #item.wave="{ value }">
      {{ value && formatNumber(value) }}
    </template>
    <template #item.data-table-expand="{ internalItem, item, toggleExpand }">
      <v-icon v-if="item.deleted" @click="toggleExpand(internalItem)"> mdi-chevron-down </v-icon>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr class="bg-grey-darken-3 text-caption">
        <td :colspan="columns.length" class="pl-12">
          <v-row class="ma-1">
            <v-col :cols="3">Deleted by (Discord ID):</v-col>
            <v-col :cols="5">
              <a :href="`https://discord.com/users/${item.deletedByDiscordId}`" target="_blank">
                {{ item.deletedByDiscordId }}
              </a>
            </v-col>
          </v-row>
          <v-row class="ma-1">
            <v-col :cols="3">Deleted at:</v-col>
            <v-col :cols="5">{{ item.deletedAt }}</v-col>
          </v-row>
        </td>
      </tr>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn-group v-if="item.id">
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
    <template #item.emptyPlaceholder="{ item }">
      <td colspan="100%">
        <!-- Span all columns -->
        <div class="placeholder-row"></div>
      </td>
    </template>
    <template v-slot:loading>
      <v-skeleton-loader
        :type="`table-row@${itemsPerPage}`"
        :height="52 * itemsPerPage"
      ></v-skeleton-loader>
    </template>
    <template v-slot:no-data> No data available </template>
  </v-data-table-server>

  <!-- Dialogs -->
  <ConfirmDialog
    :title="confirmDialog.title"
    :text="confirmDialog.text"
    v-model="showConfirmDialog"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>
