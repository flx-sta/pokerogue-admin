import { AUTH_COOKIE } from '@/constants'
import { getCookie } from '@/utils'
import RootView from '@/views/RootView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setTitle } from './stores/titleStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RootView,
      beforeEnter(_to, _from, next) {
        setTitle('Home')
        next()
      },
    },
    {
      path: '/daily',
      name: 'daily',
      component: () => import('./views/daily/DailyLayout.vue'),
      children: [
        {
          path: 'rankings',
          name: 'daily.rankings',
          component: () => import('./views/daily/DailyRankingsView.vue'),
          beforeEnter(_to, _from, next) {
            setTitle('Manage Daily Rankings')
            next()
          },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/LoginView.vue'),
      beforeEnter(_to, _from, next) {
        if (getCookie(AUTH_COOKIE)) {
          router.replace('/')
        } else {
          setTitle('Login')
          next()
        }
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = getCookie(AUTH_COOKIE) // Replace 'auth_token' with your cookie name

  if (!isLoggedIn && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
