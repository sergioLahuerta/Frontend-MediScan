import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

const mediscanTheme = {
    dark: false,
    colors: {
        primary: '#159a8e',
        'primary-dark': '#0f8b81',
        'primary-light': '#e8faf7',
        secondary: '#f5f7fa',
        accent: '#ff6b6b',
        info: '#0066cc',
        warning: '#ffc107',
        success: '#4caf50',
        error: '#f44336',
        background: '#ffffff',
        surface: '#ffffff',
        'on-primary': '#ffffff',
        'on-secondary': '#1f2937',
    },
}

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'mediscanTheme',
        themes: {
            mediscanTheme,
        },
    },
    defaults: {
        VBtn: {
            rounded: 'lg',
            elevation: 0,
        },
        VCard: {
            rounded: 'lg',
            elevation: 2,
        },
        VTextField: {
            variant: 'outlined',
            density: 'comfortable',
            color: 'primary',
        },
        VSelect: {
            variant: 'outlined',
            density: 'comfortable',
            color: 'primary',
        },
        VTextarea: {
            variant: 'outlined',
            density: 'comfortable',
            color: 'primary',
        },
    },
})
