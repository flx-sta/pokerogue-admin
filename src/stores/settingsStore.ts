import { SETTINGS_KEY } from '@/constants'
import type { SupportedLocale } from '@/types/SupportedLocale'
import type { Theme } from '@/types/Theme'
import { persistentMap } from '@nanostores/persistent'

export interface SettingsState {
  theme: Theme
  locale: SupportedLocale
  [key: string]: any
}

export const $settings = persistentMap<SettingsState>(SETTINGS_KEY, {
  theme: 'dark',
  locale: 'en-US',
})
