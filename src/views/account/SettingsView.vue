<script setup lang="ts">
import { $settings, type SettingsState } from '@/stores/settingsStore'
import type { SupportedLocale } from '@/types/SupportedLocale'
import { useStore } from '@nanostores/vue'

const settings = useStore($settings)

function handleSettingChange(key: keyof SettingsState, value: any) {
  $settings.setKey(key, value)
}
</script>

<template>
  <h1>Settings</h1>
  <v-alert
    type="info"
    text="These settings will only apply locally and are NOT synced!"
    class="ma-10"
  />
  <v-container>
    <v-combobox
      label="Theme"
      :items="['dark', 'light']"
      :model-value="settings.theme"
      @update:model-value="handleSettingChange('theme', $event)"
    ></v-combobox>

    <v-combobox
      label="Locale"
      :items="['en-US', 'de-DE']"
      :model-value="settings.locale"
      @update:model-value="handleSettingChange('locale', $event)"
    ></v-combobox>
  </v-container>
</template>
