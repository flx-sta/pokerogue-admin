import { AUTH_COOKIE } from '@/constants'
import { getCookie } from '@/utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  const isLoggedIn = getCookie(AUTH_COOKIE)

  if (!isLoggedIn && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
