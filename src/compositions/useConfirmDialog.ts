import { reactive, ref } from 'vue'

export function useConfirmDialog() {
  return reactive({
    title: '',
    text: '',
  })
}
