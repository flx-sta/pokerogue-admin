<script setup lang="ts">
import { useDailyRunsApi } from '@/api/dailyRunsApi'
import { useConfirmDialog } from '@/compositions/useConfirmDialog'
import { useLoading } from '@/compositions/useLoading'
import { usePaginatedServerTable } from '@/compositions/usePaginatedServerTable'
import { DELETE_ICON, RESTORE_ICON } from '@/constants'
import { $settings } from '@/stores/settingsStore'
import type { DailyRun, DailyRunWithId } from '@/types/DailyRun'
import { formatDate, formatNumber } from '@/utils'
import { useStore } from '@nanostores/vue'
import { computed, reactive, ref } from 'vue'
import type { VDataTable } from 'vuetify/components'
import ConfirmDialog from './ConfirmDialog.vue'

const dailyRunsApi = useDailyRunsApi(import.meta.env.VITE_API_BASE)
const settings = useStore($settings)

const { page, itemsPerPage, expandedRows, itemsLength, itemsPerPageOptions } =
  usePaginatedServerTable()
const { isLoading, startLoading, stopLoading } = useLoading()
const confirmDialog = useConfirmDialog()

const headers: VDataTable['$props']['headers'] = [
  {
    title: 'Username',
    key: 'username',
    sortable: false,
  },
  { title: 'Date', key: 'date', sortable: false },
  { title: 'Score', key: 'score', sortable: false },
  { title: 'Wave', key: 'wave', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
]

const items = ref<DailyRunWithId[]>(
  Array.from({ length: itemsPerPage.value }).map(() => ({}) as any),
)
const itemTo = reactive<{ delete: DailyRun | null; restore: DailyRun | null }>({
  delete: null,
  restore: null,
})
const showConfirmDialog = computed(() => itemTo.delete !== null || itemTo.restore !== null)

async function loadItems(limit: number, page: number) {
  startLoading()
  const { total, data } = await dailyRunsApi.getDailyRuns(limit, page)
  items.value = data.map((d) => ({ ...d, id: `${d.username}-${d.date}` }))
  if (items.value.length < itemsPerPage.value) {
    items.value = [
      ...items.value,
      ...Array.from({ length: itemsPerPage.value - items.value.length }).map(() => ({}) as any),
    ]
  }
  itemsLength.value = total
  stopLoading()
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
  confirmDialog.text = `Are you sure you want to restore run for ${run.username} on ${run.date}?`
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
    :loading="isLoading"
    :items-per-page-options="itemsPerPageOptions"
    :cell-props="
      (cell) =>
        cell.item.deleted && headers.some((h) => h.key === cell.column.key)
          ? { class: 'text-disabled' }
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
      <tr
        :class="{
          'bg-grey-darken-3': settings.theme === 'dark',
          'bg-grey-lighten-3': settings.theme === 'light',
          'text-caption': true,
        }"
      >
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
            <v-col :cols="5" :title="item.deletedAt">{{
              item.deletedAt ? formatDate(item.deletedAt) : 'n/a'
            }}</v-col>
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
    max-width="400"
    :title="confirmDialog.title"
    :text="confirmDialog.text"
    v-model="showConfirmDialog"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>
