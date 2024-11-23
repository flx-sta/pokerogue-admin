import { computed, ref } from 'vue'

export function usePaginatedServerTable() {
  const page = ref(1)
  const itemsPerPage = ref(10)
  const expandedRows = ref<string[]>([])
  const itemsLength = ref(-1)

  const itemsPerPageOptions = computed(() => [
    10,
    ...[25, 50, 100].filter((i) => i <= itemsLength.value),
  ])

  return {
    page,
    itemsPerPage,
    itemsPerPageOptions,
    expandedRows,
    itemsLength,
  }
}
