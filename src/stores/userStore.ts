import { useAccountApi } from '@/api/accountApi'
import type { User } from '@/types/User'

import { map, onMount, task } from 'nanostores'

export const $user = map<User>()

onMount($user, () => {
  if (window.location.pathname !== '/login' && !$user.get().username) {
    task(async () => {
      const accountApi = useAccountApi(import.meta.env.VITE_API_BASE)
      const user = await accountApi.info()

      if (user) {
        $user.set(user)
      }
    })
  }
})
