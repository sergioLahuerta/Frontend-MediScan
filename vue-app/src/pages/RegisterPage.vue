<template>
  <v-container fluid class="register-page fill-height pa-0">
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <!-- Toggles UI -->
    <div class="page-toggles pa-4 d-flex align-center ga-3">
      <v-btn 
        icon 
        variant="tonal" 
        color="white" 
        size="small"
        class="glass-toggle"
        @click="toggleTheme"
      >
        <v-icon size="small">{{ theme.global.name.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-menu offset-y transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="tonal"
            color="white"
            size="small"
            class="px-2 font-weight-bold glass-toggle"
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
            @click="locale = lang.code"
          >
            <v-list-item-title class="text-caption font-weight-bold">{{ lang.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <v-row no-gutters class="fill-height">
      <!-- Right side (Form) -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center pa-6 order-md-2">
        <v-card class="glass-card pa-8" width="100%" max-width="480" rounded="xl" elevation="0">
          <div class="text-center mb-8">
            <div class="logo-wrapper mb-4 d-inline-flex pa-3 bg-white rounded-xl shadow-sm">
              <v-img
                src="/logo.png"
                alt="MediScan Branding"
                width="64"
                height="64"
                contain
              />
            </div>
            <h2 class="text-h4 font-weight-bold mb-2">{{ $t('auth.registerTitle') }}</h2>
            <p class="text-body-1 text-medium-emphasis">{{ $t('auth.registerSubtitle') }}</p>
          </div>

          <v-form ref="form" v-model="valid" @submit.prevent="handleRegister">
            <v-text-field
              v-model="email"
              :label="$t('auth.emailLabel')"
              :placeholder="$t('auth.emailPlaceholder')"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-4"
              :rules="emailRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              :label="$t('auth.passwordLabel')"
              :placeholder="$t('auth.passwordPlaceholder')"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-1"
              :rules="passwordRules"
              @click:append-inner="showPassword = !showPassword"
              required
            ></v-text-field>

            <!-- Password strength indicator -->
            <div v-if="password" class="mb-4 px-1">
              <div class="d-flex gap-1 mb-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="strength-bar"
                  :class="{
                    'weak':   i <= passwordStrength && passwordStrength === 1,
                    'fair':   i <= passwordStrength && passwordStrength === 2,
                    'good':   i <= passwordStrength && passwordStrength === 3,
                    'strong': i <= passwordStrength && passwordStrength === 4,
                  }"
                />
              </div>
              <span class="text-caption" :class="strengthColor">
                {{ strengthLabel }}
              </span>
            </div>

            <v-text-field
              v-model="confirmPassword"
              :label="$t('auth.confirmPasswordLabel')"
              :placeholder="$t('auth.passwordPlaceholder')"
              prepend-inner-icon="mdi-lock-check-outline"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-6"
              :rules="confirmPasswordRules"
              required
            ></v-text-field>

            <v-btn
              type="submit"
              color="primary"
              block
              size="x-large"
              rounded="lg"
              elevation="4"
              :loading="authStore.loading"
              :disabled="!valid"
              class="register-btn py-4"
            >
              {{ $t('auth.getStartedBtn') }}
              <v-icon end>mdi-account-plus</v-icon>
            </v-btn>
          </v-form>

          <div class="text-center mt-8">
            <p class="text-body-2 text-medium-emphasis">
              {{ $t('auth.alreadyHaveAccount') }} 
              <v-btn variant="text" color="primary" density="compact" class="font-weight-bold" @click="$router.push('/login')">
                {{ $t('auth.signInLink') }}
              </v-btn>
            </p>
          </div>
        </v-card>
      </v-col>

      <!-- Left side (Info) -->
      <v-col cols="12" md="6" class="d-none d-md-flex flex-column justify-center align-center auth-hero pa-12 order-md-1">
        <div class="hero-content">
          <h1 class="text-h2 font-weight-bold text-white mb-6 text-right">
            {{ $t('auth.heroRegisterTitle') }} <span class="accent-text">{{ $t('auth.heroRegisterAccent') }}</span>
          </h1>
          <p class="text-h6 text-white text-opacity-80 mb-8 font-weight-light text-right">
            {{ $t('auth.heroRegisterSubtitle') }}
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const { locale } = i18n

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()
const theme = useTheme()

const valid = ref(false)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const emailRules = [
  (v: string) => !!v || i18n.t('validation.required'),
  (v: string) => /.+@.+\..+/.test(v) || i18n.t('validation.email'),
]

const passwordRules = [
  (v: string) => !!v || i18n.t('validation.required'),
  (v: string) => v.length >= 8 || i18n.t('validation.passLength', { min: 8 }),
  (v: string) => /[A-Z]/.test(v) || i18n.t('validation.passUpper'),
  (v: string) => /[0-9]/.test(v) || i18n.t('validation.passNumber'),
  (v: string) => /[^A-Za-z0-9]/.test(v) || i18n.t('validation.passSpecial'),
]

const confirmPasswordRules = [
  (v: string) => !!v || i18n.t('validation.required'),
  (v: string) => v === password.value || i18n.t('validation.passMatch'),
]

// Password strength score 1-4
const passwordStrength = computed(() => {
  if (!password.value) return 0
  let score = 0
  if (password.value.length >= 8) score++
  if (/[A-Z]/.test(password.value)) score++
  if (/[0-9]/.test(password.value)) score++
  if (/[^A-Za-z0-9]/.test(password.value)) score++
  return score
})

const strengthLabel = computed(() => {
  const labels = [
    '', 
    i18n.t('auth.strength.vWeak'), 
    i18n.t('auth.strength.weak'), 
    i18n.t('auth.strength.fair'), 
    i18n.t('auth.strength.strong')
  ]
  return labels[passwordStrength.value]
})

const strengthColor = computed(() => {
  const colors = ['', 'text-red', 'text-orange', 'text-amber-darken-2', 'text-success']
  return colors[passwordStrength.value]
})

const handleRegister = async () => {
  try {
    const success = await authStore.register({
      email: email.value,
      password: password.value
    })
    if (success) {
      appStore.showSnackbar('Account created! You can now login.', 'success')
      router.push('/login')
    }
  } catch (err: any) {
    appStore.showSnackbar(err.message || 'Registration failed', 'error')
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  background-color: rgb(var(--v-theme-background));
  position: relative;
  overflow: hidden;
}

.page-toggles {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}

.glass-toggle {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white !important;
}

.auth-hero {
  background: linear-gradient(225deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: rgb(var(--v-theme-on-primary));
  position: relative;
}

.glass-card {
  background: rgba(var(--v-theme-surface), 0.8) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
}

.accent-text {
  color: #ffd166;
}

.strength-bar {
  height: 4px;
  flex: 1;
  border-radius: 4px;
  background: rgba(var(--v-theme-on-surface), 0.1);
  transition: background 0.3s ease;

  &.weak   { background: #ef4444; }
  &.fair   { background: #f97316; }
  &.good   { background: #f59e0b; }
  &.strong { background: #22c55e; }
}
</style>
