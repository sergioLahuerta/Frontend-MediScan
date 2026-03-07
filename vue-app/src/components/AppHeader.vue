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
          {{ link.label }}
        </router-link>
      </nav>

      <!-- Auth & CTA Section -->
      <div class="d-none d-md-flex align-center" style="gap: 1rem;">
        <template v-if="!authStore.isAuthenticated">
          <v-btn variant="text" color="primary" @click="$router.push('/login')">Log In</v-btn>
          <v-btn color="primary" variant="tonal" rounded="lg" @click="$router.push('/register')">Join</v-btn>
        </template>
        
        <template v-else>
          <v-menu min-width="200px" rounded="lg">
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props">
                <v-avatar color="primary" size="36">
                  <v-icon color="white">mdi-account</v-icon>
                </v-avatar>
              </v-btn>
            </template>
            <v-list class="pa-2">
              <v-list-item
                prepend-icon="mdi-logout"
                title="Log Out"
                rounded="lg"
                color="error"
                @click="handleLogout"
              ></v-list-item>
            </v-list>
          </v-menu>
        </template>

        <v-divider vertical class="mx-2 my-4"></v-divider>

        <!-- Theme Switcher -->
        <v-btn icon @click="toggleTheme" title="Toggle Theme">
          <v-icon>{{ theme.global.name.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>

        <!-- Language Switcher -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn variant="text" v-bind="props" class="text-none">
              <v-icon start>mdi-translate</v-icon>
              {{ locale === 'es' ? 'ES' : 'EN' }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="setLocale('en')" :active="locale === 'en'">
              <v-list-item-title>English</v-list-item-title>
            </v-list-item>
            <v-list-item @click="setLocale('es')" :active="locale === 'es'">
              <v-list-item-title>Español</v-list-item-title>
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
          AI Simulator
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

const navLinks = computed(() => [
  { to: '/', name: 'home', label: 'Home' },
  { 
    to: authStore.isAuthenticated ? '/services' : '/#services', 
    name: authStore.isAuthenticated ? 'services' : 'home', 
    label: 'Services' 
  },
  { to: '/contact', name: 'contact', label: 'Contact' },
])

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
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
