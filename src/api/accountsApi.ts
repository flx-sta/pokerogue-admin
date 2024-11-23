import { AUTH_COOKIE } from '@/constants'
import type { Account } from '@/types/Account'
import { getCookie } from '@/utils'

export function useAccountsApi(base: string) {
  return {
    async search(username: string): Promise<Account[]> {
      try {
        const response = await fetch(`${base}/accounts?q=${username}`, {
          method: 'GET',
          headers: {
            Authorization: `${getCookie(AUTH_COOKIE)}`,
          },
        })
        if (response.ok) {
          return await response.json()
        } else {
          console.warn('Failed to get info', response)
        }
      } catch (err) {
        console.error('Error getting info:', err)
      }

      return []
    },
  }
}
