import { AUTH_COOKIE } from '@/constants'
import type { LoginResponse } from '@/types/LoginResponse'
import { setCookie } from '@/utils'

export function useAccountApi(base: string) {
  return {
    async login(username: string, password: string) {
      const formData = new URLSearchParams({ username, password })

      try {
        const response = await fetch(`${base}/account/login`, {
          method: 'POST',
          body: formData.toString(),
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
