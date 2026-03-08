<template>
  <!-- HEADER -->
  <v-app-bar
    class="app-header"
    elevation="0"
    border="b"
    height="72"
  >
    <v-container class="d-flex align-center justify-space-between h-100 py-0">
      <!-- Logo -->
      <router-link to="/" class="header-logo text-decoration-none">
        <v-img
          src="/logo.png"
          alt="MediScan Branding"
          width="40"
          height="40"
          class="mr-2"
          contain
          style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));"
        />
        <span class="logo-text font-weight-bold">MediScan</span>
      </router-link>

      <!-- Nav Desktop -->
      <nav class="d-none d-lg-flex align-center" style="gap: 2rem;">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ 'nav-link--active': isLinkActive(link) }"
        >
          {{ $t(link.label) }}
        </router-link>
      </nav>

      <!-- Auth & CTA Section -->
      <div class="d-none d-md-flex align-center" style="gap: 1rem;">
        <template v-if="!authStore.isAuthenticated">
          <v-btn variant="text" color="primary" @click="$router.push('/login')">{{ $t('nav.login') }}</v-btn>
          <v-btn color="primary" variant="tonal" rounded="lg" @click="$router.push('/register')">{{ $t('nav.join') }}</v-btn>
        </template>
        
        <template v-else>
          <v-menu min-width="200px" rounded="lg">
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props">
                <v-avatar color="white" size="36" class="border">
                  <v-img v-if="authStore.user?.profileImageUrl" :src="getFullImageUrl(authStore.user.profileImageUrl)" alt="Avatar">
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="primary-lighten-4" size="20"></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                  <v-icon v-else color="primary">mdi-account</v-icon>
                </v-avatar>
              </v-btn>
            </template>
            <v-list class="pa-2">
              <v-list-item
                prepend-icon="mdi-account-circle-outline"
                :title="$t('nav.profile')"
                rounded="lg"
                @click="$router.push('/profile')"
              ></v-list-item>
              <v-divider class="my-1" />
              <v-list-item
                prepend-icon="mdi-logout"
                :title="$t('nav.logout')"
                rounded="lg"
                color="error"
                @click="handleLogout"
              ></v-list-item>
            </v-list>
          </v-menu>
        </template>

        <v-divider vertical class="mx-2 my-4"></v-divider>

        <!-- Theme Switcher -->
        <v-btn 
          icon 
          variant="tonal" 
          color="primary" 
          size="small" 
          class="mr-2 theme-toggle-btn"
          @click="toggleTheme" 
          :title="$t('nav.toggleTheme')"
        >
          <v-icon size="small">{{ theme.global.name.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>

        <!-- Language Switcher -->
        <v-menu offset-y transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn
              variant="tonal"
              color="primary"
              size="small"
              class="px-2 font-weight-bold"
              style="min-width: 44px; height: 32px;"
              v-bind="props"
            >
              <v-icon start size="small">mdi-translate</v-icon>
              {{ locale.toUpperCase() }}
            </v-btn>
          </template>
          <v-list density="compact" rounded="lg" class="pa-2">
            <v-list-item
              v-for="lang in [{ code: 'en', label: 'English' }, { code: 'es', label: 'Español' }]"
              :key="lang.code"
              :value="lang.code"
              :active="locale === lang.code"
              color="primary"
              rounded="md"
              @click="setLocale(lang.code)"
            >
              <v-list-item-title class="text-caption font-weight-bold">{{ lang.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        
        <v-btn
          color="primary"
          rounded="lg"
          elevation="2"
          @click="$router.push('/services')"
        >
          <v-icon start>mdi-robot</v-icon>
          {{ $t('nav.aiSimulator') }}
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const theme = useTheme()
const { locale } = useI18n()

const getFullImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5073/api'
  const baseUrl = apiUrl.replace(/\/api$/, '')
  return `${baseUrl}${path}`
}

const navLinks = computed(() => [
  { to: '/', name: 'home', label: 'nav.home' },
  { 
    to: authStore.isAuthenticated ? '/services' : '/#services', 
    name: authStore.isAuthenticated ? 'services' : 'home', 
    label: 'nav.services' 
  },
  { to: '/contact', name: 'contact', label: 'nav.contact' },
])

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'es' : 'en'
}

const setLocale = (lang: string) => {
  locale.value = lang
}

const isLinkActive = (link: any) => {
  if (link.to === '/') {
    return route.name === 'home' && !route.hash
  }
  if (link.to === '/#services') {
    return route.name === 'home' && route.hash === '#services'
  }
  if (link.to === '/services') {
    return route.name === 'services'
  }
  return route.name === link.name
}
</script>

<style lang="scss" scoped>
.header-logo {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 700;
  color: #159a8e;
  letter-spacing: -0.5px;
}

.nav-link {
  text-decoration: none;
  color: inherit;
  opacity: 0.7;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;

  &:hover {
    color: #159a8e;
    opacity: 1;
  }

  &--active {
    color: #159a8e;
    opacity: 1;
    font-weight: 600;
    border-bottom-color: #159a8e;
  }
}
</style>
