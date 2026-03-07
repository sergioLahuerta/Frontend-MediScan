import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#159a8e',
          secondary: '#0f8b81',
          background: '#f9fafb',
          surface: '#ffffff',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#159a8e',
          secondary: '#0f8b81',
          background: '#0f172a',
          surface: '#1e293b',
          'surface-variant': '#334155',
          'on-surface-variant': '#f8fafc',
        },
      },
    },
  },
})
