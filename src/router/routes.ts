import { AUTH_COOKIE } from '@/constants'
import { setPageTitle } from '@/stores/pageTitleStore'
import { getCookie } from '@/utils'
import type { RouteRecordRaw } from 'vue-router'
import router from './router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashobard',
    meta: {
      crumb: 'Dashboard',
    },
    component: () => import('@/views/RootLayout.vue'),
    beforeEnter(_to, _from, next) {
      setPageTitle('Dashboard')
      next()
    },
    children: [
      {
        path: '',
        name: 'dashboard.home',
        component: () => import('@/views/DashboardView.vue'),
        beforeEnter(_to, _from, next) {
          setPageTitle('Dashboard')
          next()
        },
      },
      {
        path: 'daily',
        name: 'daily',
        meta: {
          crumb: 'Daily',
        },
        component: () => import('@/views/daily/DailyLayout.vue'),
        children: [
          {
            path: '',
            name: 'daily.home',
            component: () => import('@/views/daily/DailyHomeView.vue'),
            beforeEnter(_to, _from, next) {
              setPageTitle('Daily')
              next()
            },
          },
          {
            path: 'runs',
            name: 'daily.runs',
            meta: {
              crumb: 'Runs',
            },
            component: () => import('@/views/daily/DailyRunsView.vue'),
            beforeEnter(_to, _from, next) {
              setPageTitle('Daily Runs')
              next()
            },
          },
        ],
      },
      {
        path: 'accounts',
        name: 'accounts',
        meta: {
          crumb: 'Accounts',
        },
        children: [
          {
            path: '',
            name: 'accounts.home',
            component: () => import('@/views/accounts/AccountsHomeView.vue'),
            beforeEnter(_to, _from, next) {
              setPageTitle('Accounts')
              next()
            },
          },
          {
            path: '/search',
            name: 'accounts.search',
            meta: {
              crumb: 'Search',
            },
            component: () => import('@/views/accounts/AccountsSearchView.vue'),
            beforeEnter(_to, _from, next) {
              setPageTitle('Search Accounts')
              next()
            },
          },
        ],
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/SettingsView.vue'),
        beforeEnter(_to, _from, next) {
          setPageTitle('Settings')
          next()
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      crumb: 'Login',
    },
    component: () => import('@/views/LoginView.vue'),
    beforeEnter(_to, _from, next) {
      if (getCookie(AUTH_COOKIE)) {
        router.replace('/')
      } else {
        setPageTitle('Login')
        next()
      }
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]
