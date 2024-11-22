import { AUTH_COOKIE } from '@/constants'
import type { LoginResponse } from '@/types/LoginResponse'
import type { User } from '@/types/User'
import { getCookie, setCookie } from '@/utils'

export function useAccountApi(base: string) {
  return {
    async info(): Promise<User | undefined> {
      try {
        const response = await fetch(`${base}/account/info`, {
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
    },

    async login(username: string, password: string) {
      try {
        const response = await fetch(`${base}/account/login`, {
          method: 'POST',
          body: new URLSearchParams({ username, password }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        if (response.ok) {
          const resData: LoginResponse = await response.json()

          if (resData.token) {
            setCookie(AUTH_COOKIE, resData.token)
            return true
          }
        } else {
          console.warn('Failed to login', response)
        }
      } catch (err) {
        console.error('Error logging in:', err)
      }

      return false
    },
  }
}
