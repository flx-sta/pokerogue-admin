import { computed, reactive, ref } from 'vue'

export function usePaginatedServerTable() {
  //#region Variables

  const loadingDelay = 250
  const loading = reactive<{ status: boolean; timeout: number }>({
    status: false,
    timeout: -1,
  })
  const page = ref(1)
  const itemsPerPage = ref(10)
  const expandedRows = ref<string[]>([])
  const itemsLength = ref(-1)

  const itemsPerPageOptions = computed(() => [
    10,
    ...[25, 50, 100].filter((i) => i <= itemsLength.value),
  ])

  //#endregion
  //#region Functions

  function startLoading() {
    loading.timeout = window.setTimeout(() => (loading.status = true), loadingDelay)
  }

  function stopLoading() {
    if (loading.timeout !== -1) {
      clearTimeout(loading.timeout)
    }

    loading.status = false
  }

  //#endregion

  return {
    loading,
    page,
    itemsPerPage,
    itemsPerPageOptions,
    expandedRows,
    itemsLength,

    startLoading,
    stopLoading,
  }
}
