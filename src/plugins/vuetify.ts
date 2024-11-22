import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // Material Design Icons

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export const vuetify = createVuetify({
  components,
  directives,
})

// TODO:  consider tree-shaking instead of `*` imports
