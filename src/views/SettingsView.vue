<script setup lang="ts">
import { $settings, type SettingsState } from '@/stores/settingsStore'
import type { SupportedLocale } from '@/types/SupportedLocale'
import { useStore } from '@nanostores/vue'
import { reactive } from 'vue'

const settings = useStore($settings)

const inputs = reactive([
  {
    key: 'theme',
    label: 'Theme',
    items: ['dark', 'light'],
  },
  {
    key: 'locale',
    label: 'Locale',
    items: ['en-US', 'de-DE'],
  },
])

function handleSettingChange(key: keyof SettingsState, value: any) {
  $settings.setKey(key, value)
}
</script>

<template>
  <v-container>
    <h1>Settings</h1>
    <v-alert
      type="info"
      text="These settings will only apply locally and are NOT synced!"
      class="ma-10"
    />
    <v-container>
      <v-row>
        <v-col v-for="input in inputs" cols="12" sm="6" md="4">
          <v-combobox
            :label="input.label"
            :items="input.items"
            :model-value="settings[input.key]"
            @update:model-value="handleSettingChange(input.key, $event)"
          ></v-combobox>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
