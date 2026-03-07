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
          accent: '#2dd4bf',
          background: '#f8fafc',
          surface: '#ffffff',
          'surface-light': '#f1f5f9',
          error: '#ef4444',
          info: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#14b8a6',
          secondary: '#0d9488',
          accent: '#5eead4',
          background: '#0f172a',
          surface: '#1e293b',
          'surface-light': '#334155',
          error: '#f87171',
          info: '#60a5fa',
          success: '#34d399',
          warning: '#fbbf24',
        },
      },
    },
  },
})
