import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    welcome: 'Welcome',
    login: 'Login',
    register: 'Join Us',
  },
  es: {
    welcome: 'Bienvenido',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

export default i18n
