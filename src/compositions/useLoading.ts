import { ref } from 'vue'

/**
 *
 * @param delay The delay before the loading status is set to true
 * @returns
 */
export function useLoading(delay = 250) {
  //#region Variables

  const isLoading = ref(false)
  const timeout = ref(-1)

  //#endregion
  //#region Functions

  function startLoading() {
    timeout.value = window.setTimeout(() => (isLoading.value = true), delay)
  }

  function stopLoading() {
    if (timeout.value !== -1) {
      clearTimeout(timeout.value)
    }

    isLoading.value = false
  }

  //#endregion

  return {
    isLoading,
    startLoading,
    stopLoading,
  }
}
