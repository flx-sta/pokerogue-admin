import { useAccountApi } from './accountApi'
import { useDailyRunsApi } from './dailyRunsApi'

export function useApi(base: string) {
  return {
    account: useAccountApi(base),
    dailyRuns: useDailyRunsApi(base),
  }
}
