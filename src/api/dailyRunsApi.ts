import { AUTH_COOKIE } from '@/constants'
import type { DailyRun } from '@/types/DailyRun'
import type { PaginatedResponse } from '@/types/PaginatedResponse'
import type { SuccessResponse } from '@/types/SuccessResponse'
import { getCookie } from '@/utils'

export function useDailyRunsApi(base: string) {
  return {
    async getDailyRuns(limit: number, page: number): Promise<PaginatedResponse<DailyRun>> {
      try {
        const response = await fetch(`${base}/daily/runs?limit=${limit}&page=${page}`, {
          method: 'GET',
          headers: {
            Authorization: getCookie(AUTH_COOKIE),
          },
        })

        if (response.ok) {
          return await response.json()
        } else {
          console.warn('Failed to get daily runs', response)
        }
      } catch (err) {
        console.error('Error getting daily runs:', err)
      }

      return { total: -1, data: [] }
    },

    async softDeleteDailyRun(username: string, date: string) {
      try {
        const response = await fetch(`${base}/daily/runs?username=${username}&date=${date}`, {
          method: 'DELETE',
          headers: {
            Authorization: getCookie(AUTH_COOKIE),
          },
        })
        if (response.ok) {
          const resData: SuccessResponse = await response.json()

          if (resData.Success) {
            return true
          }
        } else {
          console.warn('Failed to delete daily run', response)
        }
      } catch (err) {
        console.error('Error deleting daily run:', err)
      }

      return false
    },

    async restoreDeletedDailyRun(username: string, date: string) {
      try {
        const response = await fetch(`${base}/daily/runs/restore`, {
          method: 'POST',
          body: new URLSearchParams({ username, date }),
          headers: {
            Authorization: getCookie(AUTH_COOKIE),
          },
        })
        if (response.ok) {
          const resData: SuccessResponse = await response.json()

          if (resData.Success) {
            return true
          }
        } else {
          console.warn('Failed to restore deleted daily run', response)
        }
      } catch (err) {
        console.error('Error restoring deleted daily run:', err)
      }

      return false
    },
  }
}
